'use client'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { backupService } from '@/lib/backup/actions'
import { cn } from '@/lib/utils'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useMounted } from '@/hooks/use-mounted'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useMemo } from 'react'

// Breadcrumb component
export const DashboardBreadcrumb = ({ defaultBreadcrumb = 'Dashboard' }: { defaultBreadcrumb?: string }) => {
  const { displayedBreadcrumbs, hiddenBreadcrumbs, pathSegments, backupId } = useBreadcrumbs(defaultBreadcrumb)
  const mounted = useMounted()

  if (!mounted) {
    return <BreadcrumbSkeleton />
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {displayedBreadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbItemComponent
            key={index}
            index={index}
            backupId={backupId}
            breadcrumb={breadcrumb?.name}
            pathSegments={pathSegments}
            totalLength={displayedBreadcrumbs.length}
            hiddenBreadcrumbs={hiddenBreadcrumbs}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

interface BreadcrumbItemProps {
  index: number
  breadcrumb: string | undefined
  totalLength: number
  pathSegments: string[]
  backupId: string | undefined
  hiddenBreadcrumbs: { name: string; path: string }[]
}

// Breadcrumb item component
const BreadcrumbItemComponent: React.FC<BreadcrumbItemProps> = ({
  index,
  backupId,
  breadcrumb,
  totalLength,
  pathSegments,
  hiddenBreadcrumbs,
}) => {
  const isEllipsis = breadcrumb === 'ellipsis'

  return (
    <>
      <BreadcrumbItem>
        {isEllipsis ? (
          <BreadcrumbEllipsisMenu hiddenBreadcrumbs={hiddenBreadcrumbs} />
        ) : (
          <BreadcrumbLink index={index} backupId={backupId} breadcrumb={breadcrumb} pathSegments={pathSegments} />
        )}
      </BreadcrumbItem>
      {index < totalLength - 1 && <BreadcrumbSeparator />}
    </>
  )
}

// Extracted component for ellipsis menu
const BreadcrumbEllipsisMenu: React.FC<{ hiddenBreadcrumbs: { name: string; path: string }[] }> = ({
  hiddenBreadcrumbs,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="flex items-center gap-1">
      <BreadcrumbEllipsis />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      {hiddenBreadcrumbs.map(({ name, path }, idx) => (
        <Link key={idx} href={path} className="underline-offset-4 hover:underline">
          <DropdownMenuItem>{name}</DropdownMenuItem>
        </Link>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
)

// Extracted breadcrumb link component
const BreadcrumbLink: React.FC<{
  index: number
  backupId: string | undefined
  breadcrumb: string | undefined
  pathSegments: string[]
}> = ({ index, backupId, breadcrumb, pathSegments }) => (
  <Link
    href={index === 0 ? '/' : `/${pathSegments.slice(0, index).join('/')}?id=${backupId}`}
    className={cn(
      'max-w-40 truncate font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline',
      index === 0 && 'text-lg',
    )}
  >
    {breadcrumb}
  </Link>
)

// Custom skeleton component for loading state
const BreadcrumbSkeleton = () => (
  <div className="flex items-center gap-4">
    <Skeleton className="h-6 w-32 rounded" />
    <Skeleton className="h-5 w-20 rounded" />
    <Skeleton className="h-5 w-20 rounded" />
  </div>
)

// useBreadcrumbs hook
export const useBreadcrumbs = (defaultBreadcrumb: string) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pathSegments = useMemo(() => pathname.split('/').filter((segment) => segment !== ''), [pathname])
  const backupId = searchParams.get('id') as string | undefined

  const [backupName, setBackupName] = React.useState<string | null>()

  // Fetch backup name if path includes backup and ID
  React.useEffect(() => {
    const loadBackupName = async () => {
      if (pathSegments[0] === 'backup' && backupId) {
        const backup = await backupService.fetch_backup_by_id(backupId)
        setBackupName(backup?.name || 'Loading...')
      } else {
        setBackupName(null)
      }
    }
    void loadBackupName()
  }, [pathSegments, backupId])

  const breadcrumbs = useMemo(
    () => generateBreadcrumbs(pathSegments, defaultBreadcrumb, backupId, backupName ?? 'Loading...'),
    [pathSegments, defaultBreadcrumb, backupId, backupName],
  )

  // Display ellipsis if more than 3 breadcrumbs
  const displayedBreadcrumbs =
    breadcrumbs.length > 3
      ? [breadcrumbs[0], { name: 'ellipsis', path: '#' }, breadcrumbs[breadcrumbs.length - 1]]
      : breadcrumbs
  const hiddenBreadcrumbs = breadcrumbs.length > 3 ? breadcrumbs.slice(1, breadcrumbs.length - 1) : []

  return { displayedBreadcrumbs, hiddenBreadcrumbs, pathSegments, backupId }
}

// Helper function to generate breadcrumbs
const generateBreadcrumbs = (
  pathSegments: string[],
  defaultBreadcrumb: string,
  backupId?: string,
  backupName?: string,
) => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
  const breadcrumbs: { name: string; path: string }[] = [{ name: defaultBreadcrumb, path: '/' }]

  if (pathSegments[0] === 'backup' && backupId) {
    breadcrumbs.push({ name: backupName || 'Loading...', path: `/backup?id=${backupId}` })
    if (pathSegments[1]) {
      breadcrumbs.push({ name: capitalize(pathSegments[1]), path: `/backup/${pathSegments[1]}?id=${backupId}` })
    }
  } else if (pathSegments[0] === 'create') {
    breadcrumbs.push({ name: 'Create', path: '/create' })
  } else {
    pathSegments.forEach((segment, index) => {
      breadcrumbs.push({ name: capitalize(segment), path: `/${pathSegments.slice(0, index + 1).join('/')}` })
    })
  }

  return breadcrumbs
}

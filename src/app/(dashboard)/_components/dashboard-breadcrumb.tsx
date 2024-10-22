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
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export const DashboardBreadcrumb = ({ defaultBreadcrumb = 'Dashboard' }: { defaultBreadcrumb?: string }) => {
  const { displayedBreadcrumbs, hiddenBreadcrumbs, pathSegments } = useBreadcrumbs(defaultBreadcrumb)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {displayedBreadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbItemComponent
            key={index}
            breadcrumb={breadcrumb.name}
            pathSegments={pathSegments}
            index={index}
            totalLength={displayedBreadcrumbs.length}
            hiddenBreadcrumbs={hiddenBreadcrumbs}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

interface BreadcrumbItemProps {
  breadcrumb: string
  pathSegments: string[]
  index: number
  totalLength: number
  hiddenBreadcrumbs: { name: string; path: string }[]
}

export const BreadcrumbItemComponent: React.FC<BreadcrumbItemProps> = ({
  breadcrumb,
  pathSegments,
  index,
  totalLength,
  hiddenBreadcrumbs,
}) => {
  const isEllipsis = breadcrumb === 'ellipsis'

  return (
    <>
      <BreadcrumbItem>
        {isEllipsis ? (
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
        ) : (
          <Link
            href={index === 0 ? '/' : `/${pathSegments.slice(0, index + 1).join('/')}`}
            className={cn(
              'max-w-40 truncate font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline',
              index === 0 && 'text-lg',
            )}
          >
            {breadcrumb}
          </Link>
        )}
      </BreadcrumbItem>
      {index < totalLength - 1 && <BreadcrumbSeparator />}
    </>
  )
}

export const useBreadcrumbs = (defaultBreadcrumb: string) => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter((segment) => segment !== '')
  const [backupName, setBackupName] = React.useState<string | null>(null)
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  React.useEffect(() => {
    const loadBackupName = async () => {
      if (pathSegments[0] === 'backup' && pathSegments[1]) {
        const backup = await backupService.fetch_backup_by_id(pathSegments[1])
        setBackupName(backup?.name || 'Loading...')
      } else {
        setBackupName(null)
      }
    }
    void loadBackupName()
  }, [pathSegments])

  const generateBreadcrumbs = () => {
    const breadcrumbs: { name: string; path: string }[] = []

    // Add defaultBreadcrumb
    breadcrumbs.push({ name: defaultBreadcrumb, path: '/' })

    if (pathSegments[0] === 'backup') {
      breadcrumbs.push({ name: backupName || 'Loading...', path: `/backup/${pathSegments[1]}` })
      if (pathSegments[2]) {
        breadcrumbs.push({ name: capitalize(pathSegments[2]), path: `/backup/${pathSegments[1]}/${pathSegments[2]}` })
      }
    } else if (pathSegments[0] === 'create') {
      breadcrumbs.push({ name: 'Create', path: '/create' })
    } else {
      // Handle other segments dynamically
      pathSegments.forEach((segment, index) => {
        breadcrumbs.push({ name: capitalize(segment), path: `/${pathSegments.slice(0, index + 1).join('/')}` })
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()
  let displayedBreadcrumbs: { name: string; path: string }[] = []
  let hiddenBreadcrumbs: { name: string; path: string }[] = []

  // Logic for handling breadcrumbs display (using ellipsis if too long)
  if (breadcrumbs.length > 3) {
    const firstBreadcrumb = breadcrumbs[0] || { name: '', path: '' }
    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1] || { name: '', path: '' }

    displayedBreadcrumbs = [
      firstBreadcrumb, // First item (with name and path)
      { name: 'ellipsis', path: '#' }, // Ellipsis as a placeholder with a dummy path
      lastBreadcrumb, // Last item (with name and path)
    ]

    hiddenBreadcrumbs = breadcrumbs.slice(1, breadcrumbs.length - 1)
  } else {
    displayedBreadcrumbs = breadcrumbs // No need to map; breadcrumbs already contain name and path
  }

  return { displayedBreadcrumbs, hiddenBreadcrumbs, pathSegments }
}

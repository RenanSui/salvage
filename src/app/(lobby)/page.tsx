'use client'

import { useBackups } from '@/hooks/use-backups'
import { cn } from '@/lib/utils'

import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useMounted } from '@/hooks/use-mounted'
import Link from 'next/link'

export default function Lobby() {
  const mounted = useMounted()
  const { data: salvageData } = useBackups()

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-28px)] bg-accent dark:bg-transparent">
        <Card className="w-full max-w-[415px] p-4 flex flex-col gap-2">
          <div
            className="animate-fade-up space-y-2"
            style={{ animationDelay: '0.20s', animationFillMode: 'both' }}
          >
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div
            className="h-8 w-24 mt-8 animate-fade-up"
            style={{ animationDelay: '0.30s', animationFillMode: 'both' }}
          >
            <Skeleton className="h-8 w-24 " />
          </div>
        </Card>
      </div>
    )
  }

  if (salvageData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-28px)] bg-accent dark:bg-transparent">
        <Card className="bg-accent/20">
          <CardHeader
            className="animate-fade-up"
            style={{ animationDelay: '0.20s', animationFillMode: 'both' }}
          >
            <CardTitle className="font-heading text-2xl">No Backups</CardTitle>
            <CardDescription>
              Initiate a new backup to begin securing your data.
            </CardDescription>
          </CardHeader>
          <CardFooter
            className="space-x-4 animate-fade-up"
            style={{ animationDelay: '0.30s', animationFillMode: 'both' }}
          >
            <Link
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'bg-transparent cursor-default',
              )}
              href="/add-new-backup"
            >
              New Backup
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-28px)] bg-accent dark:bg-transparent">
      <Card className="bg-accent/20">
        <CardHeader
          className="animate-fade-up"
          style={{ animationDelay: '0.20s', animationFillMode: 'both' }}
        >
          <CardTitle className="font-heading text-2xl">Backups</CardTitle>
          <CardDescription className="max-w-[26.875rem] flex flex-col">
            <span>
              You currently have a total of{' '}
              <span className="text-blue-700 dark:text-blue-500 font-semibold">
                {salvageData.length.toString().padStart(2, '0')} Backups{' '}
              </span>
              stored.
            </span>
            <span>Review and manage all backups on your dashboard.</span>
          </CardDescription>
        </CardHeader>
        <CardFooter
          className="space-x-2 animate-fade-up"
          style={{ animationDelay: '0.30s', animationFillMode: 'both' }}
        >
          <Link
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'bg-transparent cursor-default',
            )}
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'bg-transparent cursor-default',
            )}
            href="/add-new-backup"
          >
            New Backup
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

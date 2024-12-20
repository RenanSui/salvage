import { cn } from '@/lib/utils'
import {
  CheckIcon,
  DashboardIcon,
  DotsHorizontalIcon,
  GearIcon,
  InfoCircledIcon,
  PlayIcon,
  StopIcon,
  UpdateIcon,
} from '@radix-ui/react-icons'
import { FileIcon, FolderIcon, Trash2 } from 'lucide-react'

export type IconProps = React.HTMLAttributes<SVGElement>

export const Icons = {
  dots: DotsHorizontalIcon,
  delete: Trash2,
  file: FileIcon,
  folder: FolderIcon,
  settings: GearIcon,
  dashboard: DashboardIcon,
  about: InfoCircledIcon,
  check: CheckIcon,
  start: PlayIcon,
  stop: StopIcon,
  restart: UpdateIcon,
  logo: ({
    middleStroke,
    sideStrokes,
    ...props
  }: IconProps & {
    middleStroke?: React.HTMLAttributes<SVGElement>['className']
    sideStrokes?: React.HTMLAttributes<SVGElement>['className']
  }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M3 10H18"
        // stroke="#505154"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('stroke-[#505154] transition-all dark:stroke-[#ADAFB1]', middleStroke)}
      />
      <path
        d="M3 5H13M8 15H18"
        // stroke="#ADAFB1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('stroke-[#ADAFB1] transition-all duration-500', sideStrokes)}
      />
    </svg>
  ),
  cross: ({ className, ...props }: IconProps) => (
    <svg
      width="12"
      height="11"
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('stroke-[#ADAFB1]', className)}
      {...props}
    >
      <path
        d="M10.6429 1.41669L1.35718 9.84261M1.35718 1.41669L10.6429 9.84261"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  minus: ({ ...props }: IconProps) => (
    <svg width="12" height="3" viewBox="0 0 12 3" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.33337 1.2963H10.6667"
        stroke="#ADAFB1"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  computerUpload: ({ className, ...props }: IconProps) => (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('stroke-foreground', className)}
      {...props}
    >
      <path
        d="M10.5 1.5H2.5C2.10218 1.5 1.72064 1.65804 1.43934 1.93934C1.15804 2.22064 1 2.60218 1 3V14C1 14.3978 1.15804 14.7794 1.43934 15.0607C1.72064 15.342 2.10218 15.5 2.5 15.5H17.5C17.8978 15.5 18.2794 15.342 18.5607 15.0607C18.842 14.7794 19 14.3978 19 14V10.5M10 15.5V19.5M5 19.5H15M16.5 7.5V1.5M16.5 1.5L14 4M16.5 1.5L19 4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  home: ({ ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M11.03 2.59a1.5 1.5 0 0 1 1.94 0l7.5 6.363a1.5 1.5 0 0 1 .53 1.144V19.5a1.5 1.5 0 0 1-1.5 1.5h-5.75a.75.75 0 0 1-.75-.75V14h-2v6.25a.75.75 0 0 1-.75.75H4.5A1.5 1.5 0 0 1 3 19.5v-9.403c0-.44.194-.859.53-1.144ZM12 3.734l-7.5 6.363V19.5h5v-6.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v6.25h5v-9.403Z"
      />
    </svg>
  ),
}

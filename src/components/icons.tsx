import { cn } from '@/lib/utils'

export type IconProps = React.HTMLAttributes<SVGElement>

export const Icons = {
  logo: ({
    middleStroke,
    sideStrokes,
    ...props
  }: IconProps & {
    middleStroke?: React.HTMLAttributes<SVGElement>['className']
    sideStrokes?: React.HTMLAttributes<SVGElement>['className']
  }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 10H18"
        // stroke="#505154"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          'stroke-[#505154] dark:stroke-[#ADAFB1] transition-all',
          middleStroke,
        )}
      />
      <path
        d="M3 5H13M8 15H18"
        // stroke="#ADAFB1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          'stroke-[#ADAFB1] transition-all duration-500',
          sideStrokes,
        )}
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
    <svg
      width="12"
      height="3"
      viewBox="0 0 12 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.33337 1.2963H10.6667"
        stroke="#ADAFB1"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

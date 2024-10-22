import { type CreateBackupSchema } from '@/lib/validations/backup'

export const OverviewForm = ({ values: { destination, exclusions, name, source } }: { values: CreateBackupSchema }) => {
  return (
    <div className="flex animate-fade-up flex-col gap-6 rounded-md bg-neutral-50 p-4 dark:bg-[#1D1D1D]">
      <div>
        <h1 className="font-heading">Backup name</h1>
        <p className="max-w-[450px] truncate text-sm text-muted-foreground">{name || 'N/A'}</p>
      </div>
      <div>
        <h1 className="font-heading">Source path</h1>
        <p className="max-w-[450px] truncate text-sm text-muted-foreground">{source || 'N/A'}</p>
      </div>
      <div>
        <h1 className="font-heading">Destination path</h1>
        <p className="max-w-[450px] truncate text-sm text-muted-foreground">{destination || 'N/A'}</p>
      </div>
      <div>
        <h1 className="font-heading">Exclusions</h1>
        {exclusions.map((exclusion, index) => (
          <p className="max-w-[450px] truncate text-sm text-muted-foreground" key={index}>
            {exclusion.exclusion || 'N/A'}
          </p>
        ))}
      </div>
    </div>
  )
}

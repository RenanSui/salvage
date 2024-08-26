/* eslint-disable camelcase */
import { toast } from '@/hooks/use-toast'
import { BackupSchema } from '@/types'
import { tauriInvoke } from '../tauri'

async function select_file() {
  return (await tauriInvoke<string>('select_file')) || ''
}

async function select_folder() {
  return (await tauriInvoke<string>('select_folder')) || ''
}

async function fetch_all_backups() {
  return await tauriInvoke<BackupSchema[]>('fetch_all_backups')
}

async function fetch_backup_by_id(id: BackupSchema['id']) {
  return await tauriInvoke<BackupSchema>('fetch_backup_by_id', { id })
}

async function create_backup(backup: BackupSchema) {
  toast({ title: 'Backup Added:', description: `"${backup.name}"` })
  return (await tauriInvoke<boolean>('create_backup', { backup })) || false
}

async function rename_backup(backup: BackupSchema) {
  return (await tauriInvoke('rename_backup', { ...backup })) || false
}

async function change_backup_source(backup: BackupSchema) {
  return (await tauriInvoke('change_backup_source', { ...backup })) || false
}

async function change_backup_destination(backup: BackupSchema) {
  return (
    (await tauriInvoke('change_backup_destination', { ...backup })) || false
  )
}

async function modify_backup_exclusions(backup: BackupSchema) {
  return (await tauriInvoke('modify_backup_exclusions', { ...backup })) || false
}

async function delete_backup(id: BackupSchema['id']) {
  return (await tauriInvoke<boolean>('delete_backup', { id })) || false
}

async function load_backups() {
  return await tauriInvoke<BackupSchema[]>('load_backups')
}

async function start_watching() {
  await tauriInvoke('start_watching')
  toast({ title: 'Backup Monitoring Successfully Initialized.' })
}

async function stop_watching() {
  await tauriInvoke('stop_watching')
  toast({
    variant: 'destructive',
    title: 'Backup Monitoring Successfully Stopped.',
  })
}

async function restart_backups() {
  await tauriInvoke('restart_backups')
  toast({ title: 'Backup Monitoring Restarted Successfully.' })
}

async function start_individual_backup({ id, name }: BackupSchema) {
  await tauriInvoke('start_individual_backup', { id })
  toast({
    description: (
      <p>
        Backup <span className="font-semibold">{name}</span> Successfully{' '}
        <span className="font-semibold text-blue-500">Initialized</span>.
      </p>
    ),
  })
}

async function stop_individual_backup({ id, name }: BackupSchema) {
  await tauriInvoke('stop_individual_backup', { id })
  toast({
    description: (
      <p>
        Backup <span className="font-semibold">{name}</span> Successfully{' '}
        <span className="font-semibold text-destructive">Stopped</span>.
      </p>
    ),
  })
}

async function restart_individual_backup({ id, name }: BackupSchema) {
  await tauriInvoke('restart_individual_backup', { id })
  toast({
    description: (
      <p>
        Backup <span className="font-semibold text-blue-500">{name}</span>{' '}
        Successfully Restarted.
      </p>
    ),
  })
}

export const backupService = {
  select_file,
  select_folder,
  fetch_all_backups,
  fetch_backup_by_id,
  create_backup,
  rename_backup,
  change_backup_source,
  change_backup_destination,
  modify_backup_exclusions,
  delete_backup,
  // Watcher
  load_backups,
  start_watching,
  stop_watching,
  restart_backups,
  start_individual_backup,
  stop_individual_backup,
  restart_individual_backup,
}

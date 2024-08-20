/* eslint-disable camelcase */
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
}

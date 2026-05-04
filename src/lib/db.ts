import Dexie, { type Table } from 'dexie'
import type { Task } from '@/services/schemas/task'
import type { IAppDB } from '@/services/contracts/db'

type Schemas = Record<keyof IAppDB, string>

export class AppDB extends Dexie implements IAppDB {
  public tasks!: Table<Task, string>
  private static instance: AppDB | null = null

  constructor(schemas: Schemas) {
    super('app-db')
    this.version(1).stores({ ...schemas })
    Object.keys(schemas).forEach((key) => {
      // @ts-expect-error — atribuição dinâmica via Dexie.table
      this[key] = this.table(key)
    })
  }

  static getInstance(schemas: Schemas): AppDB {
    if (!AppDB.instance) {
      AppDB.instance = new AppDB(schemas)
    }
    return AppDB.instance
  }
}

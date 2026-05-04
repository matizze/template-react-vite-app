import Dexie, { type Table } from "dexie";
import type {
  CreateTaskSchema,
  TaskSchema,
  UpdateTaskSchema,
} from "@/schemas";
import { UIError } from "@/lib/errors/ui";
import { MOCK_TASKS } from "./fixtures";
import type { ITaskRepository } from "./repository.contract";

const nowIso = () => new Date().toISOString();

class TaskDexie extends Dexie {
  tasks!: Table<TaskSchema, string>;

  constructor() {
    super("app-tasks-db");
    this.version(1).stores({ tasks: "id, user_id, created_at" });
    this.on("populate", (tx) =>
      tx.table<TaskSchema>("tasks").bulkAdd(MOCK_TASKS),
    );
  }
}

export class DbTaskRepository implements ITaskRepository {
  private db = new TaskDexie();

  private async findOrThrow(id: string): Promise<TaskSchema> {
    const task = await this.db.tasks.get(id);
    if (!task) throw new UIError("TASK_NOT_FOUND", "Tarefa não encontrada.");
    return task;
  }

  async list(): Promise<TaskSchema[]> {
    const all = await this.db.tasks.toArray();
    return all.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async get(id: string): Promise<TaskSchema> {
    return this.findOrThrow(id);
  }

  async create({ title, description }: CreateTaskSchema): Promise<TaskSchema> {
    if (!title.trim()) {
      throw new UIError("TITLE_REQUIRED", "Título é obrigatório.");
    }
    const task: TaskSchema = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      user_id: "usr_1",
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    await this.db.tasks.add(task);
    return task;
  }

  async update(id: string, input: UpdateTaskSchema): Promise<TaskSchema> {
    const existing = await this.findOrThrow(id);
    const updated: TaskSchema = {
      ...existing,
      ...input,
      updated_at: nowIso(),
    };
    await this.db.tasks.put(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.findOrThrow(id);
    await this.db.tasks.delete(id);
  }

  async toggle(id: string): Promise<TaskSchema> {
    const existing = await this.findOrThrow(id);
    const updated: TaskSchema = {
      ...existing,
      completed: !existing.completed,
      updated_at: nowIso(),
    };
    await this.db.tasks.put(updated);
    return updated;
  }
}

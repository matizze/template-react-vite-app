import type {
  CreateTaskSchema,
  TaskSchema,
  UpdateTaskSchema,
} from "@/schemas";
import { UIError } from "@/lib/errors/ui";
import { MOCK_TASKS } from "./fixtures";
import type { ITaskRepository } from "./repository.contract";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const nowIso = () => new Date().toISOString();

export class MockTaskRepository implements ITaskRepository {
  private tasks: TaskSchema[] = [...MOCK_TASKS];

  private findOrThrow(id: string): TaskSchema {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new UIError("TASK_NOT_FOUND", "Tarefa não encontrada.");
    return task;
  }

  async list(): Promise<TaskSchema[]> {
    await delay();
    return [...this.tasks].sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    );
  }

  async get(id: string): Promise<TaskSchema> {
    await delay();
    return this.findOrThrow(id);
  }

  async create({ title, description }: CreateTaskSchema): Promise<TaskSchema> {
    await delay();
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
    this.tasks = [task, ...this.tasks];
    return task;
  }

  async update(id: string, input: UpdateTaskSchema): Promise<TaskSchema> {
    await delay();
    const existing = this.findOrThrow(id);
    const updated: TaskSchema = {
      ...existing,
      ...input,
      updated_at: nowIso(),
    };
    this.tasks = this.tasks.map((t) => (t.id === id ? updated : t));
    return updated;
  }

  async delete(id: string): Promise<void> {
    await delay();
    this.findOrThrow(id);
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  async toggle(id: string): Promise<TaskSchema> {
    await delay();
    const existing = this.findOrThrow(id);
    const updated: TaskSchema = {
      ...existing,
      completed: !existing.completed,
      updated_at: nowIso(),
    };
    this.tasks = this.tasks.map((t) => (t.id === id ? updated : t));
    return updated;
  }
}

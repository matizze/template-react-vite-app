import {
  HttpMethod,
  type HttpRequest,
  type IHttpClient,
} from '@/services/contracts/http-client'
import type { IAppDB } from '@/services/contracts/db'
import type { Task } from '@/services/schemas/task'
import type { User } from '@/services/schemas/user'
import { UIError } from '@/services/errors/ui-error'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'

export const AUTH_COOKIE_NAME = 'app_token'

const MOCK_USER: User = {
  id: 'usr_1',
  email: 'admin@app.com',
  name: 'Admin',
}

const MOCK_PASSWORD = 'password'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))
const pickDelay = () => 250 + Math.random() * 250

function makeFakeJwt(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({ sub: userId, iat: Math.floor(Date.now() / 1000) }),
  )
  const signature = btoa(`mock-${userId}-${Date.now()}`)
  return `${header}.${payload}.${signature}`
}

function getAuthenticatedUser(): User {
  const token = getCookie(AUTH_COOKIE_NAME)
  if (!token) throw new UIError('UNAUTHENTICATED', 'Not authenticated.')
  return MOCK_USER
}

function nowIso() {
  return new Date().toISOString()
}

interface MockHttpClientDeps {
  db: IAppDB
}

export class MockHttpClient implements IHttpClient {
  private db: IAppDB

  static create(deps: MockHttpClientDeps) {
    return new MockHttpClient(deps)
  }

  constructor(deps: MockHttpClientDeps) {
    this.db = deps.db
  }

  async sendRequest<TResponse, TBody = unknown>(
    request: HttpRequest<TBody>,
  ): Promise<TResponse> {
    await delay(pickDelay())

    const { method, endpoint, body } = request

    // ──────────────── AUTH ────────────────
    if (method === HttpMethod.POST && endpoint === '/auth/sign-in') {
      const { email, password } = (body ?? {}) as {
        email?: string
        password?: string
      }
      if (email !== MOCK_USER.email || password !== MOCK_PASSWORD) {
        throw new UIError(
          'INVALID_CREDENTIALS',
          'Email ou senha inválidos.',
        )
      }
      const token = makeFakeJwt(MOCK_USER.id)
      setCookie(AUTH_COOKIE_NAME, token)
      return { user: MOCK_USER, token } as unknown as TResponse
    }

    if (method === HttpMethod.GET && endpoint === '/auth/me') {
      const user = getAuthenticatedUser()
      return user as unknown as TResponse
    }

    if (method === HttpMethod.POST && endpoint === '/auth/sign-out') {
      removeCookie(AUTH_COOKIE_NAME)
      return undefined as unknown as TResponse
    }

    // ──────────────── TASKS ────────────────
    if (endpoint.startsWith('/tasks')) {
      const user = getAuthenticatedUser()

      if (method === HttpMethod.GET && endpoint === '/tasks') {
        const all = await this.db.tasks.toArray()
        const mine = all
          .filter((t) => t.user_id === user.id)
          .sort((a, b) => b.created_at.localeCompare(a.created_at))
        return mine as unknown as TResponse
      }

      const idMatch = endpoint.match(/^\/tasks\/([^/]+)(\/toggle)?$/)
      if (idMatch) {
        const id = decodeURIComponent(idMatch[1])
        const isToggle = !!idMatch[2]

        if (method === HttpMethod.GET && !isToggle) {
          const task = await this.db.tasks.get(id)
          if (!task || task.user_id !== user.id) {
            throw new UIError('TASK_NOT_FOUND', 'Tarefa não encontrada.')
          }
          return task as unknown as TResponse
        }

        if (method === HttpMethod.PUT && !isToggle) {
          const existing = await this.db.tasks.get(id)
          if (!existing || existing.user_id !== user.id) {
            throw new UIError('TASK_NOT_FOUND', 'Tarefa não encontrada.')
          }
          const data = (body ?? {}) as Partial<Task>
          const updated: Task = {
            ...existing,
            ...(data.title !== undefined ? { title: data.title } : {}),
            ...(data.description !== undefined
              ? { description: data.description }
              : {}),
            ...(data.completed !== undefined
              ? { completed: data.completed }
              : {}),
            updated_at: nowIso(),
          }
          await this.db.tasks.put(updated)
          return updated as unknown as TResponse
        }

        if (method === HttpMethod.DELETE && !isToggle) {
          const existing = await this.db.tasks.get(id)
          if (!existing || existing.user_id !== user.id) {
            throw new UIError('TASK_NOT_FOUND', 'Tarefa não encontrada.')
          }
          await this.db.tasks.delete(id)
          return undefined as unknown as TResponse
        }

        if (method === HttpMethod.PATCH && isToggle) {
          const existing = await this.db.tasks.get(id)
          if (!existing || existing.user_id !== user.id) {
            throw new UIError('TASK_NOT_FOUND', 'Tarefa não encontrada.')
          }
          const updated: Task = {
            ...existing,
            completed: !existing.completed,
            updated_at: nowIso(),
          }
          await this.db.tasks.put(updated)
          return updated as unknown as TResponse
        }
      }

      if (method === HttpMethod.POST && endpoint === '/tasks') {
        const { title = '', description = '' } = (body ?? {}) as {
          title?: string
          description?: string
        }
        if (!title.trim()) {
          throw new UIError('TITLE_REQUIRED', 'Título é obrigatório.')
        }
        const task: Task = {
          id: crypto.randomUUID(),
          title: title.trim(),
          description: description.trim(),
          completed: false,
          user_id: user.id,
          created_at: nowIso(),
          updated_at: nowIso(),
        }
        await this.db.tasks.add(task)
        return task as unknown as TResponse
      }
    }

    throw new Error(`MockHttpClient: rota não mapeada → ${method} ${endpoint}`)
  }
}

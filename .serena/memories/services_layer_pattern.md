# Padrão da Camada de Services (Use-Cases + DI)

A camada de domínio é organizada em **use-cases**, cada um implementando `IUseCase<TInput, TOutput>`. Toda dependência externa (HTTP) entra via construtor — nunca instanciada dentro do use-case.

## Contratos base (`src/services/contracts/`)

```ts
// use-case.ts
export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>
}

// http-client.ts
export const HttpMethod = { GET, POST, PUT, PATCH, DELETE } as const
export interface HttpRequest<TBody = unknown> {
  method, endpoint, body?, query?, headers?
}
export interface IHttpClient {
  sendRequest<TResponse, TBody = unknown>(req: HttpRequest<TBody>): Promise<TResponse>
}

// db.ts
export interface IAppDB {
  tasks: { toArray, get, add, delete, update, clear, put }  // assinaturas Dexie-like
}
```

## Estrutura de uma feature de services

```
services/<feature>/
├── index.ts                       # createXxxServices(httpClient) → factory
├── services/
│   └── <verb-noun>.usecase.ts     # 1 classe por use-case
└── types/
    └── <verb-noun>.ts             # ENDPOINT, Request, Response (+ tipos compartilhados)
```

Exemplo (`services/tasks/services/create-task.usecase.ts`):

```ts
export class CreateTaskUseCase implements IUseCase<UseCaseInput, UseCaseOutput> {
  private client: IHttpClient
  constructor(client: IHttpClient) { this.client = client }

  async execute(input: UseCaseInput): Promise<UseCaseOutput> {
    if (!input.title?.trim()) throw new Error('Title is required')
    return this.client.sendRequest<UseCaseOutput>({
      method: HttpMethod.POST,
      endpoint: ENDPOINT,
      body: { title: input.title.trim(), description: input.description?.trim() ?? '' },
    })
  }
}
```

## Convenções dos use-cases
- Filename: `<verb-noun>.usecase.ts` (kebab-case).
- Classe: `<VerbNoun>UseCase` (PascalCase).
- Sempre exporta `UseCaseInput` e `UseCaseOutput` para reuso em models de páginas.
- `ENDPOINT` mora no arquivo de types junto com `Request`/`Response`.
- Validações triviais (campo obrigatório) ficam no use-case com `throw new Error(...)`.
- Erros de domínio que precisam de UX específica → `throw new UIError(code, msg)`.
- Inputs `void` quando não há parâmetros (ex.: `ListTasksUseCase`, `SignOutUseCase`, `GetCurrentUserUseCase`).

## Factory por feature (`index.ts`)

```ts
// services/tasks/index.ts
export function createTaskServices(httpClient: IHttpClient) {
  return {
    listTasks: new ListTasksUseCase(httpClient),
    getTask: new GetTaskUseCase(httpClient),
    createTask: new CreateTaskUseCase(httpClient),
    updateTask: new UpdateTaskUseCase(httpClient),
    deleteTask: new DeleteTaskUseCase(httpClient),
    toggleTask: new ToggleTaskUseCase(httpClient),
  }
}
```

## Registry agregador (`src/services/registry.ts`)

```ts
export interface RegistryDeps { httpClient: IHttpClient }

export function createAllServices(deps: RegistryDeps) {
  return {
    ...createAuthServices(deps.httpClient),
    ...createTaskServices(deps.httpClient),
  }
}

export type ServiceContextProps = ReturnType<typeof createAllServices>
```

## Use-cases existentes

**Auth:**
- `signIn({ email, password })` → `{ user, token }`
- `signOut()` → `void` (mock remove cookie no servidor mock)
- `getCurrentUser()` → `User` (lê cookie e devolve user; lança `UIError('UNAUTHENTICATED')` se ausente)

**Tasks:**
- `listTasks()` → `Task[]`
- `getTask({ id })` → `Task`
- `createTask({ title, description? })` → `Task`
- `updateTask({ id, data: { title?, description?, completed? } })` → `Task`
- `deleteTask({ id })` → `void`
- `toggleTask({ id })` → `Task` (inverte `completed`)

## Como uma página consome

```ts
const { signIn } = useServices()
const signInMutation = useMutation({
  mutationFn: () => signIn.execute({ email, password }),
})
```

Para auth, prefira o hook `useAuth()` que já encapsula query+mutations.

## Erros: `UIError`

```ts
export class UIError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message); this.name = 'UIError'; this.code = code
  }
}
```

Códigos lançados pelo mock atual:
- `UNAUTHENTICATED` — falta cookie em `/auth/me`, `/tasks/*`.
- `INVALID_CREDENTIALS` — email/senha errados.
- `TASK_NOT_FOUND` — id inexistente ou de outro usuário.
- `TITLE_REQUIRED` — POST /tasks sem título.

Padrão em models/views:
```ts
onError: (err: unknown) => {
  if (err instanceof UIError) setErrorMessage(err.message)
  else if (err instanceof Error) setErrorMessage(err.message)
  else setErrorMessage('Erro inesperado.')
}
```

## Mock HTTP (`src/http/mock.client.ts`)
Implementa `IHttpClient`. Diferenças em relação ao padrão "stateless":
- Recebe `{ db: IAppDB }` no construtor — atua como pseudo-servidor lendo/escrevendo Dexie.
- Mantém credenciais via `document.cookie` (`app_token`).
- Validação de auth em todas as rotas `/tasks/*` via `getAuthenticatedUser()` que lê o cookie.
- Filtra tasks por `user_id` (multi-tenant simulado).
- Latência simulada 250–500ms.

Para trocar por implementação real (axios/fetch):
1. Criar `src/http/api.client.ts` implementando `IHttpClient`.
2. Substituir em `service.provider.tsx`:
   ```ts
   const httpClient = useMemo(
     () => ApiHttpClient.create({ baseURL: '...', credentials: 'include' }),
     [],
   )
   ```
3. Remover o `db` do `service.provider.tsx` (não é mais necessário).

Nenhum use-case nem página precisa mudar.

## DB singleton (`src/lib/db.ts`)
`AppDB extends Dexie implements IAppDB`. Banco: `'app-db'`. Schema atual:
```ts
AppDB.getInstance({ tasks: 'id, user_id' })
```
- `'id'` é a primary key.
- `'user_id'` é índice secundário (queries futuras por usuário ficam baratas).

`getInstance(schemas)` garante uma única instância.

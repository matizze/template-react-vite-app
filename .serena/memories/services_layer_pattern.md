# Padrão da Camada de Services (Use-Cases + ServiceFactory)

A camada de domínio é organizada em **use-cases**, cada um implementando `IUseCase<TInput, TOutput>`. Toda dependência externa (HTTP) entra via construtor — nunca instanciada dentro do use-case. A composição usa **ServiceFactory** com namespacing tipado.

## Contratos (`src/types/contracts/`)

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

## Schemas (`src/types/schemas/`)
Entidades de domínio puras:

```ts
// user.ts
export interface User { id: string; email: string; name: string }

// task.ts
export interface Task {
  id, title, description, completed, user_id, created_at, updated_at: string
}
```

## Estrutura de uma feature de services

```
services/<feature>/
├── index.ts                       # register<Feature>(http) — builder
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

## Builder por feature (`<feature>/index.ts`)

Cada feature exporta uma função-builder curried que recebe `http` e retorna uma função que recebe o `NamespaceBuilder`:

```ts
// services/tasks/index.ts
import type { IHttpClient } from "@/types/contracts/http-client"
import type { NamespaceBuilder } from "@/lib/factory"

export const registerTasks = (http: IHttpClient) => (b: NamespaceBuilder) =>
  b.register("list",   new ListTasksUseCase(http))
   .register("get",    new GetTaskUseCase(http))
   .register("create", new CreateTaskUseCase(http))
   .register("update", new UpdateTaskUseCase(http))
   .register("delete", new DeleteTaskUseCase(http))
   .register("toggle", new ToggleTaskUseCase(http))
```

```ts
// services/auth/index.ts
export const registerAuth = (http: IHttpClient) => (b: NamespaceBuilder) =>
  b.register("signIn",         new SignInUseCase(http))
   .register("signOut",        new SignOutUseCase(http))
   .register("getCurrentUser", new GetCurrentUserUseCase(http))
```

> Nomes dos use-cases dentro do namespace ficam **curtos** (sem o prefixo do domínio) — `tasks.list`, não `tasks.listTasks`.

## Composição central (`src/services/index.ts`)

```ts
import type { IHttpClient } from "@/types/contracts/http-client"
import { ServiceFactory } from "@/lib/factory"
import { registerAuth } from "./auth"
import { registerTasks } from "./tasks"

export interface ServiceFactoryDeps {
  httpClient: IHttpClient
}

export function createServices({ httpClient }: ServiceFactoryDeps) {
  return new ServiceFactory()
    .ns("auth", registerAuth(httpClient))
    .ns("tasks", registerTasks(httpClient))
    .build()
}

export type Services = ReturnType<typeof createServices>
```

`Services` é `{ auth: { signIn, signOut, getCurrentUser }, tasks: { list, get, create, update, delete, toggle } }` — totalmente inferido.

## Use-cases existentes

**Auth (namespace `auth`):**
- `signIn({ email, password })` → `{ user, token }`
- `signOut()` → `void`
- `getCurrentUser()` → `User`

**Tasks (namespace `tasks`):**
- `list()` → `Task[]`
- `get({ id })` → `Task`
- `create({ title, description? })` → `Task`
- `update({ id, data: { title?, description?, completed? } })` → `Task`
- `delete({ id })` → `void`
- `toggle({ id })` → `Task`

## Como uma página consome

```ts
const { signIn } = useServices().auth
const signInMutation = useMutation({
  mutationFn: () => signIn.execute({ email, password }),
})

const { list, create, toggle, delete: remove } = useServices().tasks
// `delete` é palavra reservada → renomeia no destructure
```

Para auth, prefira o hook `useAuth()` que já encapsula query+mutations.

## Erros: `UIError` (`src/lib/errors/ui-error.ts`)

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

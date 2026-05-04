# Roteamento, Auth Cookie e Persistência

## Roteamento (Wouter)

Lib usada: `wouter` v3 (alternativa ultra-leve ao react-router).

**Definição em `src/App.tsx`:**
```tsx
<Switch>
  <Route path="/login" component={LoginPage} />
  <Route path="/tasks">
    <ProtectedRoute>
      <TasksPage />
    </ProtectedRoute>
  </Route>
  <Route path="/">
    <Redirect to="/tasks" />
  </Route>
  <Route><NotFound /></Route>  {/* fallback 404 */}
</Switch>
```

**Hooks de wouter usados:**
- `useLocation()` — `[location, navigate]`. Para navegação programática: `navigate('/tasks', { replace: true })`.
- `useParams<{ id: string }>()` — params da rota.
- `<Redirect to="..." />` — redireciona declarativamente.

**Convenções:**
- Rotas em **inglês** (`/login`, `/tasks`).
- Navegação **a partir do model** (não do view).
- Rotas protegidas envolvidas com `<ProtectedRoute>`.

## Auth via cookie (JWT mock)

### `src/lib/cookies.ts`
API minimal:
```ts
getCookie(name): string | null
setCookie(name, value, { maxAgeSeconds = 604800, path = '/', sameSite = 'Lax', secure = isHttps })
removeCookie(name, path = '/')
```

### Fluxo
1. **Sign-in**: `POST /auth/sign-in` (mock). Em sucesso, mock chama `setCookie('app_token', fakeJwt)` e devolve `{ user, token }`. `useAuth().signIn` popula `queryClient.setQueryData(['auth','me'], user)`.
2. **GetCurrentUser**: `GET /auth/me`. Mock lê cookie via `getCookie('app_token')` — se ausente, lança `UIError('UNAUTHENTICATED')`. Caso contrário devolve `MOCK_USER`.
3. **Sign-out**: `POST /auth/sign-out`. Mock chama `removeCookie('app_token')`. `useAuth().signOut` chama `queryClient.removeQueries()` para limpar cache e navega pra `/login`.
4. **Session check**: ao montar a app, `useAuth()` dispara `meQuery` (`retry: false`). Se cookie está válido → user logado. Senão → `ProtectedRoute` redireciona pra `/login`.

### Para HTTP real
- Backend deve setar cookie HttpOnly (mock atual usa cookie acessível via JS — limitação do mock). Cliente HTTP real → `fetch(..., { credentials: 'include' })`.
- `lib/cookies.ts` continua útil para ler/limpar tokens não-HttpOnly (ex.: refresh tokens em SPA).

## TanStack Query

**Defaults globais (`src/providers/query.provider.tsx`):**
```ts
{
  staleTime: 30_000,
  gcTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
}
```

Cliente criado uma vez via `useState(() => new QueryClient(...))` para sobreviver a hot-reloads.

**queryKeys atuais:**
- `['auth', 'me']` — sessão atual (override `retry: false`, `staleTime: 5 * 60_000`).
- `['tasks']` — lista de tarefas do usuário logado.

**Padrão de invalidação (tasks):**
```ts
const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
```
Toda mutation chama no `onSuccess`.

**Sign-out:** `queryClient.removeQueries()` zera todo o cache — evita vazar dados se outro usuário logar em sequência.

## Persistência local — Dexie/IndexedDB

**Schema** (`src/services/contracts/db.ts`):
```ts
export interface IAppDB {
  tasks: { toArray, get, add, delete, update, clear, put }
}
```

**Implementação** (`src/lib/db.ts`):
```ts
export class AppDB extends Dexie implements IAppDB {
  public tasks!: Table<Task, string>
  constructor(schemas) {
    super('app-db')
    this.version(1).stores({ ...schemas })
    Object.keys(schemas).forEach((key) => { this[key] = this.table(key) })
  }
  static getInstance(schemas) { /* singleton */ }
}
```

**Inicialização** (`src/providers/service.provider.tsx`):
```ts
const db = useMemo(() => AppDB.getInstance({ tasks: 'id, user_id' }), [])
const httpClient = useMemo(() => MockHttpClient.create({ db }), [db])
```

A string `'id, user_id'` é a sintaxe Dexie de schema — `id` é PK, `user_id` é índice secundário.

## Schemas

```ts
// src/services/schemas/user.ts
export interface User {
  id: string
  email: string
  name: string
}

// src/services/schemas/task.ts
export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  user_id: string
  created_at: string
  updated_at: string
}
```

## Mock backend (`src/http/mock.client.ts`)

`MockHttpClient` recebe `{ db: IAppDB }` no construtor e simula um servidor:

| Rota                          | Método | Ação                                                     |
|-------------------------------|--------|----------------------------------------------------------|
| `/auth/sign-in`               | POST   | Valida email/senha; seta cookie `app_token`              |
| `/auth/me`                    | GET    | Lê cookie; devolve `User` ou `UIError('UNAUTHENTICATED')`|
| `/auth/sign-out`              | POST   | Remove cookie                                             |
| `/tasks`                      | GET    | `db.tasks.toArray()` filtrado por `user_id`              |
| `/tasks`                      | POST   | Valida title; `db.tasks.add(task)`                       |
| `/tasks/:id`                  | GET    | `db.tasks.get(id)` validando ownership                   |
| `/tasks/:id`                  | PUT    | Valida ownership; `db.tasks.put(merged)`                 |
| `/tasks/:id`                  | DELETE | Valida ownership; `db.tasks.delete(id)`                  |
| `/tasks/:id/toggle`           | PATCH  | Inverte `completed`; `db.tasks.put(updated)`             |

**Credenciais hardcoded:** `admin@app.com` / `password`.

**Para trocar pelo backend real:**
1. Criar `src/http/api.client.ts` implementando `IHttpClient` (axios/fetch + `credentials: 'include'`).
2. Substituir em `service.provider.tsx`: `const httpClient = useMemo(() => ApiHttpClient.create({ baseURL }), [])`.
3. Remover `db` do provider (a menos que queira persistência local separada).
4. Os use-cases continuam idênticos.

## Snippets úteis para o template

**Adicionar nova feature de services** (mesma receita do mock):
1. `src/services/<feature>/types/<verb-noun>.ts` — request/response/endpoint.
2. `src/services/<feature>/services/<verb-noun>.usecase.ts` — classe.
3. `src/services/<feature>/index.ts` — `createXxxServices(httpClient)` factory.
4. Espalhar a factory em `src/services/registry.ts` (`...createXxxServices(deps.httpClient)`).
5. Se for endpoint mockado: adicionar handler em `src/http/mock.client.ts`.

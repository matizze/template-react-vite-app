# Padrão MVVM das Páginas

Cada página em `src/pages/<feature>/` é dividida em 4 arquivos com responsabilidades estritas:

```
pages/<feature>/
├── index.tsx     # default export — orquestra: const m = useModel(); return <View {...m} />
├── model.ts      # hook useXxxModel() — todo state, queries, mutations, handlers
├── view.tsx      # XxxView(props: ReturnType<typeof useXxxModel>) — só apresentação
└── skeleton.tsx  # XxxSkeleton (loading/error states)
```

## index.tsx — sempre minimalista
```tsx
import { useTasksModel } from './model'
import { TasksView } from './view'

export default function TasksPage() {
  const methods = useTasksModel()
  return <TasksView {...methods} />
}
```

## model.ts — toda a lógica
Padrões:
- Importa `useServices`, `useAuth` (quando necessário), `useQuery`/`useMutation`/`useQueryClient`, `useLocation`/`useParams` de wouter.
- Define funções puras helper **fora** do hook quando há transformação sem state.
- Usa `useState` para UI state local (form, modais).
- Usa `useMemo` para derivados a partir de queries (sempre memoizar `data ?? defaultValue` antes de derivar).
- Define `handleXxx` como functions dentro do hook.
- Retorna um objeto plano com queries, valores derivados, e handlers.

Esqueleto (visto em `pages/tasks/model.ts`):
```ts
export function useTasksModel() {
  const [, navigate] = useLocation()
  const queryClient = useQueryClient()
  const { user, signOut, isSigningOut } = useAuth()
  const { listTasks, createTask, toggleTask, deleteTask } = useServices()

  const tasksQuery = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: () => listTasks.execute(),
  })

  const tasks = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data])

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length
    return { total: tasks.length, completed, pending: tasks.length - completed }
  }, [tasks])

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })

  const createMutation = useMutation({
    mutationFn: (input: { title: string; description: string }) =>
      createTask.execute(input),
    onSuccess: invalidate,
  })

  // ... toggle, delete

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return { user, tasks, stats, isLoading, isMutating, handleCreate, handleToggle, handleRemove, handleSignOut, isSigningOut }
}
```

> **Pitfall TanStack Query**: `const tasks = tasksQuery.data ?? []` cria um novo array a cada render. Se `tasks` for usado em `useMemo`/`useCallback` deps, vai disparar reexecução infinita. Memoize: `useMemo(() => tasksQuery.data ?? [], [tasksQuery.data])`.

## view.tsx — só JSX
- Tipo das props **sempre** é `ReturnType<typeof useXxxModel>`. Sem interface manual.
- Faz **destructuring** logo no início.
- Decide entre `<XxxSkeleton />`, `<XxxErrorSkeleton />` e o conteúdo real, baseado nos flags da query (`isLoading`, `isError`, `data`).
- Usa `<AppLayout>` + `<Navbar>` + componentes de domínio.
- Não chama hooks (em geral).
- Não conhece `useServices` nem `useQuery`.

```tsx
export function TasksView(props: ReturnType<typeof useTasksModel>) {
  const { user, tasks, stats, isLoading, /* ... */ } = props
  return <AppLayout>{/* ... */}</AppLayout>
}
```

## skeleton.tsx — loading + error
- Mantém o mesmo layout (AppLayout + Navbar) para evitar flash.
- Pode aceitar `inline?: boolean` para variantes embutidas (ex.: `TasksSkeleton inline` substitui só a lista, sem refazer o shell).
- Usa `<Skeleton />` do shadcn.

## Convenções de queryKey
- Tuple `[entidade, ...identificadores]`: `['auth', 'me']`, `['tasks']`, `['tasks', id]`.
- Mutations chamam `queryClient.invalidateQueries({ queryKey: ['tasks'] })` no `onSuccess`.
- `signOut` chama `queryClient.removeQueries()` (limpa tudo) — evita vazar dados de usuário ao trocar conta.

## Mutations padrão
```ts
const createMutation = useMutation({
  mutationFn: (input) => createTask.execute(input),
  onSuccess: invalidate,
  onError: (err: unknown) => {
    if (err instanceof UIError) setErrorMessage(err.message)
    else if (err instanceof Error) setErrorMessage(err.message)
    else setErrorMessage('Erro inesperado.')
  },
})
```

## Páginas existentes
- `pages/login/` — formulário sign-in. Modelo redireciona pra `/tasks` quando autenticado (via `useEffect`).
- `pages/tasks/` — CRUD de tarefas. Skeleton tem variante `inline` para o estado de loading da lista.

## Adicionar nova página (receita)
1. `src/pages/<feature>/index.tsx` — orquestrador (4 linhas).
2. `src/pages/<feature>/model.ts` — hook `useXxxModel()`.
3. `src/pages/<feature>/view.tsx` — `XxxView(props: ReturnType<typeof useXxxModel>)`.
4. `src/pages/<feature>/skeleton.tsx` — `XxxSkeleton`.
5. Adicionar `<Route>` em `src/App.tsx` (envolva com `<ProtectedRoute>` se exigir auth).

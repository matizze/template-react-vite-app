# Providers, Context e Injeção de Dependências

## Composição de providers
Em `src/providers/app.provider.tsx`, dois providers aninhados:

```tsx
<QueryProvider>
  <ServiceProvider>{children}</ServiceProvider>
</QueryProvider>
```

`main.tsx` envolve `<App/>` com `<AppProvider>` dentro de `<StrictMode>`.

## QueryProvider (`query.provider.tsx`)
- Cria `QueryClient` em `useState(() => new QueryClient(...))` para garantir uma instância estável por mount.
- Defaults globais: `staleTime: 30_000`, `gcTime: 5 * 60_000`, `retry: 1`, `refetchOnWindowFocus: false`.

## ServiceProvider (`service.provider.tsx` + `service.context.ts`)
Padrão **Context + DI manual** com `useMemo` para singletons. Importante: o **DB é construído antes do HTTP client** porque o mock recebe o DB:

```ts
const db = useMemo(() => AppDB.getInstance({ tasks: 'id, user_id' }), [])
const httpClient = useMemo(() => MockHttpClient.create({ db }), [db])
const services = useMemo(() => createServices({ httpClient }), [httpClient])
```

- `services` é o retorno de `createServices({ httpClient })` em `src/services/index.ts`.
- `createServices` usa `new ServiceFactory().ns("auth", registerAuth(http)).ns("tasks", registerTasks(http)).build()`.
- Tipagem do context: `ServiceContextProps = Services` (= `ReturnType<typeof createServices>`) — sem duplicar interface.
- Default value do `createContext`: cast `{} as ServiceContextProps`.

> Nota arquitetural: hoje **só o HTTP client conhece o DB** (porque o mock simula um servidor que persiste). Em produção real, os use-cases continuam falando só com `IHttpClient`; o DB sai do registry. Se quiser persistência local de leitura/escrita direta (cache, drafts, fila offline), passe o `db` como dep adicional via `ServiceFactoryDeps` e use nos registers.

## ServiceFactory (`src/lib/factory.ts`)
Infra genérica do padrão Factory com namespacing tipado. Duas classes:

```ts
class NamespaceBuilder<T> {
  register<K, V>(key: K, instance: V): NamespaceBuilder<T & { [P in K]: V }>
  build(): T
}

class ServiceFactory<T> {
  ns<K, NS>(name: K, fn: (b: NamespaceBuilder) => NamespaceBuilder<NS>): ServiceFactory<T & { [P in K]: NS }>
  build(): T
}
```

Mora em `lib/` por ser infra reusável (não conhece domínio nem HTTP). Cada `register` acumula tipos via interseção; `ns` aninha namespaces. Resultado de `.build()` é objeto plano com inferência total.

## Hook `useServices` (`src/hooks/use-services.ts`)
Centraliza o consumo do `ServiceContext`. Páginas/components destruturam pelo namespace:

```ts
const { signIn, signOut, getCurrentUser } = useServices().auth
const { list, create, toggle, delete: remove } = useServices().tasks
```

> `delete` é palavra reservada — use rename no destructure (`delete: remove`).

## Hook `useAuth` (`src/hooks/use-auth.ts`)
Wrapper que combina `useQuery` (para `getCurrentUser`) + `useMutation` (para `signIn` e `signOut`). Não há `AuthProvider` separado — o estado vive no cache do TanStack Query, indexado por `['auth', 'me']`.

```ts
const {
  user,
  isAuthenticated,
  isLoading,        // checando sessão
  signIn,           // mutateAsync({ email, password })
  signOut,
  isSigningIn,
  isSigningOut,
  signInError,
} = useAuth()
```

Comportamentos chave:
- `signIn` em sucesso popula `queryClient.setQueryData(['auth','me'], data.user)` — não refetch.
- `signOut` em sucesso limpa `['auth','me']` e remove **todas** as queries (`queryClient.removeQueries()`) — evita vazar dados do usuário antigo se logar outro.
- `meQuery.retry: false` — se cookie inválido/ausente o `getCurrentUser` lança `UIError('UNAUTHENTICATED')` e a query não fica ressuscitando.

## ProtectedRoute (`src/components/auth/protected-route.tsx`)
Guard simples que envolve children. Se `!isAuthenticated && !isLoading`, navega pra `/login`. Enquanto carrega, renderiza `TasksSkeleton`.

```tsx
<Route path="/tasks">
  <ProtectedRoute>
    <TasksPage />
  </ProtectedRoute>
</Route>
```

## Padrão para adicionar novo serviço
1. Criar use-case em `src/services/<dominio>/services/<acao>.usecase.ts` implementando `IUseCase<Input, Output>`.
2. Definir tipos em `src/services/<dominio>/types/<acao>.ts` (Request/Response + `ENDPOINT` quando HTTP).
3. Adicionar uma linha `.register("<verb>", new <Verb>UseCase(http))` no `register<Domain>` do `src/services/<dominio>/index.ts`.
4. Se for um domínio novo, criar `src/services/<dominio>/index.ts` com `register<Domain> = (http) => (b) => b.register(...)` e adicionar `.ns("<dominio>", register<Domain>(http))` em `createServices` (`src/services/index.ts`).
5. Consumir em qualquer hook `model.ts` via `useServices().<dominio>.<verb>`.

Sem boilerplate de tipagem manual no Context — tudo é inferido pela ServiceFactory.

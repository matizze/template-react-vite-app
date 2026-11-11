import type { ReactNode } from 'react'
import { Redirect, Route, Switch } from 'wouter'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AppLayout } from '@/components/layout/app-layout'
import { AuthLayout } from '@/components/layout/auth-layout'
import ComponentsPage from '@/pages/components'
import LoginPage from '@/pages/login'
import NotFoundPage from '@/pages/not-found'
import TasksPage from '@/pages/tasks'

/** Rotas autenticadas: guard + shell (sidebar/header). O AppLayout é preservado entre páginas. */
function Private({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <Switch>
      <Route path="/login">
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      </Route>

      <Route path="/tasks">
        <Private>
          <TasksPage />
        </Private>
      </Route>

      <Route path="/components">
        <Private>
          <ComponentsPage />
        </Private>
      </Route>

      <Route path="/">
        <Redirect to="/tasks" />
      </Route>

      <Route component={NotFoundPage} />
    </Switch>
  )
}

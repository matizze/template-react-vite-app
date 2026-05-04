import { Redirect, Route, Switch } from "wouter";
import LoginPage from "@/pages/login";
import TasksPage from "@/pages/tasks";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function App() {
    return (
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
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}

function NotFound() {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-2xl font-semibold">404</p>
            <p className="text-sm text-muted-foreground">Page not found.</p>
        </div>
    );
}

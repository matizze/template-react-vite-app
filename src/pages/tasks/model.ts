import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'wouter'
import { useServices } from '@/hooks/use-services'
import { useAuth } from '@/hooks/use-auth'

const TASKS_QUERY_KEY = ['tasks'] as const

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

  const toggleMutation = useMutation({
    mutationFn: (id: string) => toggleTask.execute({ id }),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask.execute({ id }),
    onSuccess: invalidate,
  })

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return {
    user,
    tasks,
    stats,
    isLoading: tasksQuery.isLoading,
    isMutating:
      createMutation.isPending ||
      toggleMutation.isPending ||
      deleteMutation.isPending,
    handleCreate: (data: { title: string; description: string }) =>
      createMutation.mutate(data),
    handleToggle: (id: string) => toggleMutation.mutate(id),
    handleRemove: (id: string) => deleteMutation.mutate(id),
    handleSignOut,
    isSigningOut,
  }
}

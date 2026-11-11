import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRepositories } from '@/providers/repository'
import type { CreateTaskSchema, TaskSchema } from '@/schemas'

const TASKS_QUERY_KEY = ['tasks'] as const

export function useTasksModel() {
  const queryClient = useQueryClient()
  const { tasks } = useRepositories()

  const tasksQuery = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: () => tasks.list(),
  })

  const list = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data])

  const stats = useMemo(() => {
    const completed = list.filter((t) => t.completed).length
    return { total: list.length, completed, pending: list.length - completed }
  }, [list])

  const invalidate = () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })

  const createMutation = useMutation({
    mutationFn: (input: CreateTaskSchema) => tasks.create(input),
    onSuccess: invalidate,
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => tasks.toggle(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })
      const previous = queryClient.getQueryData<TaskSchema[]>(TASKS_QUERY_KEY)
      queryClient.setQueryData<TaskSchema[]>(TASKS_QUERY_KEY, (old) =>
        old?.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      )
      return { previous }
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, context?.previous)
      toast.error("Couldn't update task. Please try again.")
    },
    onSettled: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tasks.delete(id),
    onSuccess: invalidate,
  })

  return {
    tasks: list,
    stats,
    isLoading: tasksQuery.isLoading,
    isCreating: createMutation.isPending,
    isMutating: createMutation.isPending || deleteMutation.isPending,
    handleCreate: (data: CreateTaskSchema) => createMutation.mutate(data),
    handleToggle: (id: string) => toggleMutation.mutate(id),
    handleRemove: (id: string) => deleteMutation.mutate(id),
  }
}

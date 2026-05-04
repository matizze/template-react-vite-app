import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRepositories } from '@/providers/repository'

const QUERY_KEY = ['auth', 'me'] as const

export function useAuth() {
  const queryClient = useQueryClient()
  const { auth } = useRepositories()

  const meQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => auth.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60_000,
  })

  const signInMutation = useMutation({
    mutationFn: (input: { email: string; password: string }) => auth.signIn(input),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data.user)
    },
  })

  const signOutMutation = useMutation({
    mutationFn: () => auth.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEY, null)
      queryClient.removeQueries()
    },
  })

  return {
    user: meQuery.data ?? null,
    isAuthenticated: !!meQuery.data,
    isLoading: meQuery.isLoading,
    isFetching: meQuery.isFetching,
    signIn: signInMutation.mutate,
    signOut: signOutMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    signInError: signInMutation.error,
  }
}

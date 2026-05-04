import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServices } from './use-services'

const QUERY_KEY = ['auth', 'me'] as const

export function useAuth() {
  const queryClient = useQueryClient()
  const { signIn, signOut, getCurrentUser } = useServices()

  const meQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getCurrentUser.execute(),
    retry: false,
    staleTime: 5 * 60_000,
  })

  const signInMutation = useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      signIn.execute(input),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data.user)
    },
  })

  const signOutMutation = useMutation({
    mutationFn: () => signOut.execute(),
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
    signIn: signInMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    signInError: signInMutation.error,
  }
}

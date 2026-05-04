import { useContext } from 'react'
import { RepositoryContext } from './context'

export function useRepositories() {
  const ctx = useContext(RepositoryContext)
  if (!ctx) {
    throw new Error('useRepositories must be used within a RepositoryProvider')
  }
  return ctx
}

import type { User } from '@/services/schemas/user'

export const ENDPOINT = '/auth/me'

export type GetCurrentUserRequest = void
export type GetCurrentUserResponse = User

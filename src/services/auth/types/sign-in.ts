import type { User } from '@/services/schemas/user'

export const ENDPOINT = '/auth/sign-in'

export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  user: User
  token: string
}

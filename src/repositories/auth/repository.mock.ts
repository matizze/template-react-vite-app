import type { SignInSchema, UserSchema } from '@/schemas'
import { UIError } from '@/lib/errors/ui'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'
import { MOCK_PASSWORD, MOCK_USER } from './fixtures'
import type { IAuthRepository, SignInOutput } from './repository.contract'

const AUTH_COOKIE = 'app_token'
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

export class MockAuthRepository implements IAuthRepository {
  async signIn({ email, password }: SignInSchema): Promise<SignInOutput> {
    await delay()
    if (email !== MOCK_USER.email || password !== MOCK_PASSWORD) {
      throw new UIError('INVALID_CREDENTIALS', 'Email ou senha inválidos.')
    }
    const token = `mock.${MOCK_USER.id}.${Date.now()}`
    setCookie(AUTH_COOKIE, token)
    return { user: MOCK_USER, token }
  }

  async signOut(): Promise<void> {
    await delay()
    removeCookie(AUTH_COOKIE)
  }

  async getCurrentUser(): Promise<UserSchema> {
    await delay()
    if (!getCookie(AUTH_COOKIE)) {
      throw new UIError('UNAUTHENTICATED', 'Not authenticated.')
    }
    return MOCK_USER
  }
}

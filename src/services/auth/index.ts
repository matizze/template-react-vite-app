import type { IHttpClient } from '../contracts/http-client'
import { SignInUseCase } from './services/sign-in.usecase'
import { SignOutUseCase } from './services/sign-out.usecase'
import { GetCurrentUserUseCase } from './services/get-current-user.usecase'

export function createAuthServices(httpClient: IHttpClient) {
  return {
    signIn: new SignInUseCase(httpClient),
    signOut: new SignOutUseCase(httpClient),
    getCurrentUser: new GetCurrentUserUseCase(httpClient),
  }
}

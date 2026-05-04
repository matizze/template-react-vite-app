import {
  HttpMethod,
  type IHttpClient,
} from '@/services/contracts/http-client'
import type { IUseCase } from '@/services/contracts/use-case'
import {
  ENDPOINT,
  type SignInRequest,
  type SignInResponse,
} from '../types/sign-in'

export type UseCaseInput = SignInRequest
export type UseCaseOutput = SignInResponse

export class SignInUseCase implements IUseCase<UseCaseInput, UseCaseOutput> {
  private client: IHttpClient

  constructor(client: IHttpClient) {
    this.client = client
  }

  async execute(input: UseCaseInput): Promise<UseCaseOutput> {
    const { email, password } = input
    if (!email) throw new Error('Email is required')
    if (!password) throw new Error('Password is required')

    return this.client.sendRequest<UseCaseOutput>({
      method: HttpMethod.POST,
      endpoint: ENDPOINT,
      body: { email, password },
    })
  }
}

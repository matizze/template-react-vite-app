import {
  HttpMethod,
  type IHttpClient,
} from '@/services/contracts/http-client'
import type { IUseCase } from '@/services/contracts/use-case'
import { ENDPOINT } from '../types/sign-out'

export type UseCaseInput = void
export type UseCaseOutput = void

export class SignOutUseCase implements IUseCase<UseCaseInput, UseCaseOutput> {
  private client: IHttpClient

  constructor(client: IHttpClient) {
    this.client = client
  }

  async execute(): Promise<UseCaseOutput> {
    await this.client.sendRequest<UseCaseOutput>({
      method: HttpMethod.POST,
      endpoint: ENDPOINT,
    })
  }
}

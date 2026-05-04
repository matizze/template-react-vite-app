import {
  HttpMethod,
  type IHttpClient,
} from '@/services/contracts/http-client'
import type { IUseCase } from '@/services/contracts/use-case'
import { ENDPOINT, type ListTasksResponse } from '../types/list-tasks'

export type UseCaseInput = void
export type UseCaseOutput = ListTasksResponse

export class ListTasksUseCase
  implements IUseCase<UseCaseInput, UseCaseOutput>
{
  private client: IHttpClient

  constructor(client: IHttpClient) {
    this.client = client
  }

  async execute(): Promise<UseCaseOutput> {
    return this.client.sendRequest<UseCaseOutput>({
      method: HttpMethod.GET,
      endpoint: ENDPOINT,
    })
  }
}

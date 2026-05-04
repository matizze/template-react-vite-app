import {
  HttpMethod,
  type IHttpClient,
} from '@/services/contracts/http-client'
import type { IUseCase } from '@/services/contracts/use-case'
import {
  ENDPOINT,
  type ToggleTaskRequest,
  type ToggleTaskResponse,
} from '../types/toggle-task'

export type UseCaseInput = ToggleTaskRequest
export type UseCaseOutput = ToggleTaskResponse

export class ToggleTaskUseCase
  implements IUseCase<UseCaseInput, UseCaseOutput>
{
  private client: IHttpClient

  constructor(client: IHttpClient) {
    this.client = client
  }

  async execute({ id }: UseCaseInput): Promise<UseCaseOutput> {
    if (!id) throw new Error('Task id is required')

    return this.client.sendRequest<UseCaseOutput>({
      method: HttpMethod.PATCH,
      endpoint: `${ENDPOINT}/${id}/toggle`,
    })
  }
}

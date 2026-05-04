import {
  HttpMethod,
  type IHttpClient,
} from '@/services/contracts/http-client'
import type { IUseCase } from '@/services/contracts/use-case'
import {
  ENDPOINT,
  type UpdateTaskRequest,
  type UpdateTaskResponse,
} from '../types/update-task'

export type UseCaseInput = UpdateTaskRequest
export type UseCaseOutput = UpdateTaskResponse

export class UpdateTaskUseCase
  implements IUseCase<UseCaseInput, UseCaseOutput>
{
  private client: IHttpClient

  constructor(client: IHttpClient) {
    this.client = client
  }

  async execute({ id, data }: UseCaseInput): Promise<UseCaseOutput> {
    if (!id) throw new Error('Task id is required')

    return this.client.sendRequest<UseCaseOutput>({
      method: HttpMethod.PUT,
      endpoint: `${ENDPOINT}/${id}`,
      body: data,
    })
  }
}

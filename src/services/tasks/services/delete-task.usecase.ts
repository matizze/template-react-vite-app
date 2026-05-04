import {
  HttpMethod,
  type IHttpClient,
} from '@/services/contracts/http-client'
import type { IUseCase } from '@/services/contracts/use-case'
import {
  ENDPOINT,
  type DeleteTaskRequest,
  type DeleteTaskResponse,
} from '../types/delete-task'

export type UseCaseInput = DeleteTaskRequest
export type UseCaseOutput = DeleteTaskResponse

export class DeleteTaskUseCase
  implements IUseCase<UseCaseInput, UseCaseOutput>
{
  private client: IHttpClient

  constructor(client: IHttpClient) {
    this.client = client
  }

  async execute({ id }: UseCaseInput): Promise<UseCaseOutput> {
    if (!id) throw new Error('Task id is required')

    await this.client.sendRequest<UseCaseOutput>({
      method: HttpMethod.DELETE,
      endpoint: `${ENDPOINT}/${id}`,
    })
  }
}

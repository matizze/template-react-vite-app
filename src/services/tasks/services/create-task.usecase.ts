import {
  HttpMethod,
  type IHttpClient,
} from '@/services/contracts/http-client'
import type { IUseCase } from '@/services/contracts/use-case'
import {
  ENDPOINT,
  type CreateTaskRequest,
  type CreateTaskResponse,
} from '../types/create-task'

export type UseCaseInput = CreateTaskRequest
export type UseCaseOutput = CreateTaskResponse

export class CreateTaskUseCase
  implements IUseCase<UseCaseInput, UseCaseOutput>
{
  private client: IHttpClient

  constructor(client: IHttpClient) {
    this.client = client
  }

  async execute(input: UseCaseInput): Promise<UseCaseOutput> {
    if (!input.title?.trim()) throw new Error('Title is required')

    return this.client.sendRequest<UseCaseOutput>({
      method: HttpMethod.POST,
      endpoint: ENDPOINT,
      body: {
        title: input.title.trim(),
        description: input.description?.trim() ?? '',
      },
    })
  }
}

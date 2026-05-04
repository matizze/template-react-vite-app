import type { IHttpClient } from '../contracts/http-client'
import { ListTasksUseCase } from './services/list-tasks.usecase'
import { GetTaskUseCase } from './services/get-task.usecase'
import { CreateTaskUseCase } from './services/create-task.usecase'
import { UpdateTaskUseCase } from './services/update-task.usecase'
import { DeleteTaskUseCase } from './services/delete-task.usecase'
import { ToggleTaskUseCase } from './services/toggle-task.usecase'

export function createTaskServices(httpClient: IHttpClient) {
  return {
    listTasks: new ListTasksUseCase(httpClient),
    getTask: new GetTaskUseCase(httpClient),
    createTask: new CreateTaskUseCase(httpClient),
    updateTask: new UpdateTaskUseCase(httpClient),
    deleteTask: new DeleteTaskUseCase(httpClient),
    toggleTask: new ToggleTaskUseCase(httpClient),
  }
}

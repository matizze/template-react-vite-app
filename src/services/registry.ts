import type { IHttpClient } from './contracts/http-client'
import { createAuthServices } from './auth'
import { createTaskServices } from './tasks'

export interface RegistryDeps {
  httpClient: IHttpClient
}

export function createAllServices(deps: RegistryDeps) {
  return {
    ...createAuthServices(deps.httpClient),
    ...createTaskServices(deps.httpClient),
  }
}

export type ServiceContextProps = ReturnType<typeof createAllServices>

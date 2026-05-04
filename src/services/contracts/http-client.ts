export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod]

export interface HttpRequest<TBody = unknown> {
  method: HttpMethod
  endpoint: string
  body?: TBody
  query?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
}

export interface IHttpClient {
  sendRequest<TResponse, TBody = unknown>(
    request: HttpRequest<TBody>,
  ): Promise<TResponse>
}

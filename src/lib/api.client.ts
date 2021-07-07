import { queryClient } from './query.client'

type ApiOptions = {
  data?: Record<string, any>
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'
}

const api = async <TResult = Record<string, any>>(
  url: string,
  { data: requestData, method }: ApiOptions = {}
): Promise<TResult> => {
  const init: RequestInit = {
    method: method || (requestData ? 'POST' : 'GET'),
    headers: requestData && { 'Content-Type': 'application/json' },
    body: requestData && JSON.stringify(requestData),
  }

  const response = await fetch(url, init)

  if (response.status === 401) {
    queryClient.clear()
    return Promise.reject({ message: 'Please Login' })
  }

  const responseData = (await response.json()) as TResult

  if (response.ok) {
    return responseData
  }

  return Promise.reject(responseData)
}

export { api }

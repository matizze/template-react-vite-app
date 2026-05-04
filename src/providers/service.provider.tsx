import { useMemo, type ReactNode } from 'react'
import { ServiceContext } from './service.context'
import { createAllServices } from '@/services/registry'
import { MockHttpClient } from '@/http/mock.client'
import { AppDB } from '@/lib/db'

export function ServiceProvider({ children }: { children: ReactNode }) {
  const db = useMemo(() => AppDB.getInstance({ tasks: 'id, user_id' }), [])
  const httpClient = useMemo(() => MockHttpClient.create({ db }), [db])
  const services = useMemo(
    () => createAllServices({ httpClient }),
    [httpClient],
  )

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  )
}

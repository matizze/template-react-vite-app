import { createContext } from 'react'
import type { ServiceContextProps } from '@/services/registry'

export type { ServiceContextProps }

export const ServiceContext = createContext<ServiceContextProps>(
  {} as ServiceContextProps,
)

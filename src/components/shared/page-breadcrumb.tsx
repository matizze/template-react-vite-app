import { Fragment, type ReactNode } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface Crumb {
  label: string
  href: string
}

interface PageBreadcrumbProps {
  pageTitle: string
  /** Níveis intermediários entre "Home" e a página atual. */
  crumbs?: Crumb[]
  /** Ações à direita (ex.: botão "Novo"). */
  actions?: ReactNode
}

/** Cabeçalho padrão das páginas internas: título + trilha de navegação. */
export function PageBreadcrumb({ pageTitle, crumbs = [], actions }: PageBreadcrumbProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-title-lg font-semibold text-gray-800 dark:text-white/90">{pageTitle}</h2>

      <div className="flex items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {crumbs.map((crumb) => (
              <Fragment key={crumb.href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink to={crumb.href}>{crumb.label}</BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            ))}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {actions}
      </div>
    </div>
  )
}

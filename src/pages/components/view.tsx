import { PageBreadcrumb } from '@/components/shared/page-breadcrumb'
import { PageMeta } from '@/components/shared/page-meta'
import { StatCard } from '@/components/shared/stat-card'
import { Badge } from '@/components/ui/badge'
import { ArrowDownIcon, ArrowUpIcon, BoxIcon, DollarIcon, UsersIcon } from '@/icons'
import type { useComponentsModel } from './model'
import { ActionsSection } from './sections/actions'
import { DataDisplaySection } from './sections/data-display'
import { FeedbackSection } from './sections/feedback'
import { FormsSection } from './sections/forms'

/** Vitrine do design system Matizze: todos os primitivos em uso, claro e escuro. */
export function ComponentsView(props: ReturnType<typeof useComponentsModel>) {
  return (
    <>
      <PageMeta title="Components" description="Matizze design system showcase." />
      <PageBreadcrumb pageTitle="Components" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
        <StatCard
          label="Customers"
          value="3,782"
          icon={<UsersIcon />}
          trend={
            <Badge color="success" size="sm">
              <ArrowUpIcon />
              11.0%
            </Badge>
          }
        />
        <StatCard
          label="Orders"
          value="5,359"
          icon={<BoxIcon />}
          trend={
            <Badge color="error" size="sm">
              <ArrowDownIcon />
              9.05%
            </Badge>
          }
        />
        <StatCard
          label="Revenue"
          value="R$ 48.2k"
          icon={<DollarIcon />}
          trend={
            <Badge color="success" size="sm">
              <ArrowUpIcon />
              4.3%
            </Badge>
          }
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 xl:grid-cols-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <ActionsSection />
          <FormsSection {...props} />
        </div>
        <div className="flex flex-col gap-4 md:gap-6">
          <FeedbackSection {...props} />
          <DataDisplaySection {...props} />
        </div>
      </div>
    </>
  )
}

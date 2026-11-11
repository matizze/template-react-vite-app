import { ComponentCard } from '@/components/shared/component-card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress-bar'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { AlertIcon, CheckCircleIcon, InfoCircleIcon, OctagonAlertIcon } from '@/icons'
import type { useComponentsModel } from '../model'

type Props = Pick<
  ReturnType<typeof useComponentsModel>,
  'progress' | 'handleProgressStep' | 'handleToast'
>

export function FeedbackSection({ progress, handleProgressStep, handleToast }: Props) {
  return (
    <>
      <ComponentCard title="Alerts">
        <Alert variant="success">
          <CheckCircleIcon />
          <AlertTitle>Payment received</AlertTitle>
          <AlertDescription>Your invoice #1042 was paid.</AlertDescription>
        </Alert>
        <Alert variant="info">
          <InfoCircleIcon />
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>Maintenance is scheduled for Sunday night.</AlertDescription>
        </Alert>
        <Alert variant="warning">
          <AlertIcon />
          <AlertTitle>Storage almost full</AlertTitle>
          <AlertDescription>You have used 92% of your plan.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <OctagonAlertIcon />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>We couldn&apos;t process your request.</AlertDescription>
        </Alert>
      </ComponentCard>

      <ComponentCard title="Toasts, progress & loading">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => handleToast('success')}>
            Success toast
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleToast('error')}>
            Error toast
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleToast('info')}>
            Info toast
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleToast('warning')}>
            Warning toast
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Progress value={progress} className="flex-1" />
          <span className="w-10 text-end text-sm text-gray-500 dark:text-gray-400">
            {progress}%
          </span>
          <Button size="xs" variant="outline" onClick={handleProgressStep}>
            Step
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Spinner className="text-brand-500 size-6" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Avatar size="lg">
            <AvatarFallback>MZ</AvatarFallback>
            <AvatarBadge variant="online" />
          </Avatar>
          <AvatarGroup>
            {['AB', 'CD', 'EF', 'GH'].map((initials) => (
              <Avatar key={initials}>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </ComponentCard>
    </>
  )
}

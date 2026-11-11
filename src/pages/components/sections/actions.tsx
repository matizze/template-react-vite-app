import { ComponentCard } from '@/components/shared/component-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, PlusIcon, TrashBinIcon } from '@/icons'

const BADGE_COLORS = ['primary', 'success', 'error', 'warning', 'info', 'gray'] as const

export function ActionsSection() {
  return (
    <>
      <ComponentCard title="Buttons" description="Variants, sizes and icons.">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <PlusIcon />
            New item
          </Button>
          <Button variant="outline">
            Continue
            <ArrowRightIcon />
          </Button>
          <Button variant="outline" size="icon" aria-label="Delete">
            <TrashBinIcon />
          </Button>
        </div>
      </ComponentCard>

      <ComponentCard title="Badges" description="Light, solid and ghost in every color.">
        {(['light', 'solid', 'ghost'] as const).map((variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-3">
            {BADGE_COLORS.map((color) => (
              <Badge key={color} variant={variant} color={color}>
                {color}
              </Badge>
            ))}
          </div>
        ))}
      </ComponentCard>
    </>
  )
}

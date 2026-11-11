import { ComponentCard } from '@/components/shared/component-card'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { MailIcon } from '@/icons'
import type { useComponentsModel } from '../model'

type Props = Pick<
  ReturnType<typeof useComponentsModel>,
  'notifications' | 'plan' | 'handleNotificationsChange' | 'handlePlanChange'
>

const PLANS = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'business', label: 'Business' },
]

export function FormsSection({
  notifications,
  plan,
  handleNotificationsChange,
  handlePlanChange,
}: Props) {
  return (
    <>
      <ComponentCard title="Inputs" description="Text fields, states and addons.">
        <FieldGroup>
          <Field>
            <FieldLabel>Full name</FieldLabel>
            <Input placeholder="Jane Doe" />
            <FieldDescription>As it appears on your documents.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <MailIcon className="size-5 text-gray-500 dark:text-gray-400" />
              </InputGroupAddon>
              <InputGroupInput type="email" placeholder="you@company.com" />
            </InputGroup>
          </Field>
          <Field data-invalid>
            <FieldLabel>Document</FieldLabel>
            <Input defaultValue="123.456" aria-invalid />
            <FieldError>Invalid document number.</FieldError>
          </Field>
          <Field>
            <FieldLabel>Disabled</FieldLabel>
            <Input disabled placeholder="Not editable" />
          </Field>
          <Field>
            <FieldLabel>Notes</FieldLabel>
            <Textarea rows={3} placeholder="Write something…" />
          </Field>
        </FieldGroup>
      </ComponentCard>

      <ComponentCard title="Selection" description="Select, checkbox, radio and switch.">
        <FieldGroup>
          <Field>
            <FieldLabel>Plan</FieldLabel>
            <Select
              items={PLANS}
              value={plan}
              onValueChange={(value) => handlePlanChange(String(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {PLANS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <RadioGroup
            value={plan}
            onValueChange={(value) => handlePlanChange(String(value))}
            className="flex flex-wrap gap-6"
          >
            {PLANS.map((item) => (
              <Field key={item.value} orientation="horizontal" className="w-auto gap-2.5">
                <RadioGroupItem id={`plan-${item.value}`} value={item.value} />
                <Label htmlFor={`plan-${item.value}`} className="cursor-pointer">
                  {item.label}
                </Label>
              </Field>
            ))}
          </RadioGroup>

          <Field orientation="horizontal" className="w-auto gap-3">
            <Checkbox id="terms" defaultChecked />
            <Label htmlFor="terms" className="cursor-pointer font-normal">
              I accept the terms and conditions
            </Label>
          </Field>

          <Field orientation="horizontal" className="w-auto gap-3">
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={handleNotificationsChange}
            />
            <Label htmlFor="notifications" className="cursor-pointer font-normal">
              Email notifications {notifications ? 'on' : 'off'}
            </Label>
          </Field>
        </FieldGroup>
      </ComponentCard>
    </>
  )
}

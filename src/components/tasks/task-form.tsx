import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTaskSchema, type CreateTaskSchema } from '@/schemas'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PlusIcon } from '@/icons'

interface TaskFormProps {
  onSubmit: (data: CreateTaskSchema) => void
  isSubmitting: boolean
}

export function TaskForm({ onSubmit, isSubmitting }: TaskFormProps) {
  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: '', description: '' },
  })

  function handleSubmit(data: CreateTaskSchema) {
    onSubmit(data)
    form.reset()
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <FieldGroup>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Title</FieldLabel>
              <Input
                placeholder="What needs to be done?"
                aria-invalid={fieldState.invalid || undefined}
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                placeholder="Optional details…"
                rows={4}
                aria-invalid={fieldState.invalid || undefined}
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          <PlusIcon />
          {isSubmitting ? 'Adding…' : 'Add task'}
        </Button>
      </FieldGroup>
    </form>
  )
}

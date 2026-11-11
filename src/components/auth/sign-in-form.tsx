import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, type SignInSchema } from '@/schemas'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { EyeCloseIcon, EyeIcon, OctagonAlertIcon } from '@/icons'

interface SignInFormProps {
  onSubmit: (data: SignInSchema) => void
  isSubmitting: boolean
  error?: Error | null
}

export function SignInForm({ onSubmit, isSubmitting, error }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  })

  return (
    <div className="w-full">
      <div className="mb-5 sm:mb-8">
        <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
          Sign in
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Use <code className="font-mono">admin@app.com</code> /{' '}
          <code className="font-mono">password</code>
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Email <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  aria-invalid={fieldState.invalid || undefined}
                  {...field}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Password <span className="text-red-500">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={fieldState.invalid || undefined}
                    {...field}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="text-gray-500 dark:text-gray-400"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-current" />
                      ) : (
                        <EyeCloseIcon className="fill-current" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {error?.message && (
            <Alert variant="destructive">
              <OctagonAlertIcon />
              <AlertDescription className="text-red-600 dark:text-red-400">
                {error.message}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}

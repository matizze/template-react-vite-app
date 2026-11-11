import { Toaster as Sonner, type ToasterProps } from 'sonner'
import {
  AlertIcon,
  CheckCircleIcon,
  InfoCircleIcon,
  LoaderCircleIcon,
  OctagonAlertIcon,
} from '@/icons'
import { useTheme } from '@/providers/theme'

function Toaster(props: ToasterProps) {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CheckCircleIcon className="size-5 text-green-500" />,
        info: <InfoCircleIcon className="size-5 text-sky-500" />,
        warning: <AlertIcon className="size-5 text-amber-500" />,
        error: <OctagonAlertIcon className="size-5 text-red-500" />,
        loading: <LoaderCircleIcon className="size-5 animate-spin text-gray-500" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'rounded-xl! border-gray-200! bg-white! p-4! font-sans! text-gray-800! shadow-theme-lg! dark:border-gray-800! dark:bg-gray-900! dark:text-white/90!',
          description: 'text-gray-500! dark:text-gray-400!',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

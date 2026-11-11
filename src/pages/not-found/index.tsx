import { Link } from 'wouter'
import { GridShape } from '@/components/shared/grid-shape'
import { PageMeta } from '@/components/shared/page-meta'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="relative z-1 flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-white p-6 dark:bg-gray-900">
      <PageMeta title="Page not found" />
      <GridShape />

      <div className="mx-auto w-full max-w-60.5 text-center sm:max-w-118">
        <h1 className="text-title-md xl:text-title-2xl mb-8 font-bold text-gray-800 dark:text-white/90">
          ERROR
        </h1>

        <img
          src="/images/error/404.svg"
          alt="404"
          className="dark:hidden"
          width={472}
          height={152}
        />
        <img
          src="/images/error/404-dark.svg"
          alt="404"
          className="hidden dark:block"
          width={472}
          height={152}
        />

        <p className="mt-10 mb-6 text-base text-gray-700 sm:text-lg dark:text-gray-400">
          We can’t seem to find the page you are looking for!
        </p>

        <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/" />}>
          Back to home
        </Button>
      </div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Matizze
      </p>
    </div>
  )
}

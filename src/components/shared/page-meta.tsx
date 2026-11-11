const APP_NAME = 'Matizze'

interface PageMetaProps {
  title: string
  description?: string
}

/** Define o <title> e a meta description da página (o React 19 eleva essas tags ao <head>). */
export function PageMeta({ title, description }: PageMetaProps) {
  return (
    <>
      <title>{`${title} | ${APP_NAME}`}</title>
      {description && <meta name="description" content={description} />}
    </>
  )
}

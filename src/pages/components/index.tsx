import { useComponentsModel } from './model'
import { ComponentsView } from './view'

export default function ComponentsPage() {
  const methods = useComponentsModel()
  return <ComponentsView {...methods} />
}

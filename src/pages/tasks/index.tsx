import { useTasksModel } from './model'
import { TasksView } from './view'

export default function TasksPage() {
  const methods = useTasksModel()
  return <TasksView {...methods} />
}

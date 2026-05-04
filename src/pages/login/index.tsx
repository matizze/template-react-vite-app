import { useLoginModel } from './model'
import { LoginView } from './view'

export default function LoginPage() {
  const methods = useLoginModel()
  return <LoginView {...methods} />
}

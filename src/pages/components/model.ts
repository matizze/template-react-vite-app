import { useState } from 'react'
import { toast } from 'sonner'

/** Estado de demonstração da vitrine de componentes (sem dados remotos). */
export function useComponentsModel() {
  const [notifications, setNotifications] = useState(true)
  const [plan, setPlan] = useState('pro')
  const [progress, setProgress] = useState(64)
  const [page, setPage] = useState(2)

  return {
    notifications,
    plan,
    progress,
    page,
    handleNotificationsChange: setNotifications,
    handlePlanChange: setPlan,
    handlePageChange: setPage,
    handleProgressStep: () => setProgress((p) => (p >= 100 ? 0 : Math.min(100, p + 12))),
    handleToast: (kind: 'success' | 'error' | 'info' | 'warning') => {
      const messages = {
        success: 'Changes saved successfully.',
        error: "Couldn't save your changes.",
        info: 'A new version is available.',
        warning: 'Your session expires in 5 minutes.',
      }
      toast[kind](messages[kind])
    },
  }
}

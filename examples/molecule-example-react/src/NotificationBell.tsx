import { eqNumber } from 'fp-ts/lib/Eq'
import { useAtom } from '@pfgray/molecule-react'
import { hasNewNotifications } from './notifications'
import { Eq } from 'fp-ts/lib/boolean' 

export const NotificationBell = () => {
  const hasNew = useAtom(hasNewNotifications, Eq)

  return (
    <div>{hasNew ? 'new!' : ''}</div>
  )
}

NotificationBell.whyDidYouRender = true
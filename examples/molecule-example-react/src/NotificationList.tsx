import { useAtom } from '@pfgray/molecule-react'
import { notificationEq, notifications as notificationsA, readNotification } from './notifications'
import * as REA from 'fp-ts/ReadonlyArray'

export const NotificationList = () => {
  const notifications = useAtom(notificationsA, REA.getEq(notificationEq))

  return (
    <>
    <div>{
      notifications.map(n => 
        <li key={n.id} onClick={readNotification(n.id)}>n.message ({n.read ? 'read' : 'unread'})</li>
      )}
    </div>
    </>
  )
}

NotificationList.whyDidYouRender = true
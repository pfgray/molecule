import { makeAtom, map } from "@pfgray/molecule"

import * as REA from 'fp-ts/ReadonlyArray'
import { pipe } from "fp-ts/function"
import { getStructEq } from "fp-ts/lib/Eq"
import { Eq as eqString } from 'fp-ts/string'
import { Eq as eqBoolean } from 'fp-ts/boolean'

type Notification = {
  id: string,
  message: string,
  read: boolean
}

const emptyREA = <A>(): ReadonlyArray<A> => []

const [updateNotifications, notificationsA] = makeAtom(emptyREA<Notification>())

export const addNotification = (n: Notification) => () => updateNotifications(REA.append(n))

export const addExampleNotification = updateNotifications(REA.append({
  id: Date.now().toString(),
  message: 'hello!',
  read: false as boolean
}))

export const readNotification = (id: string) => updateNotifications(REA.map(n => n.id === id ? {
  ...n,
  read: true
} : n))

export const notificationCount = pipe(notificationsA, map(a => a.length))

export const unreadNotifications = pipe(notificationsA, map(REA.filter(a => !a.read)))

export const hasNewNotifications = pipe(unreadNotifications, map(unread => unread.length > 0))

export const notifications = notificationsA

export const notificationEq = pipe(getStructEq({
  id: eqString,
  message: eqString,
  read: eqBoolean
}))
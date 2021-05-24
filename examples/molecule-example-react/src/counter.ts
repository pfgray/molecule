import { Subject } from 'rxjs'
import { reducerFromActionStream, forActions } from '@pfgray/molecule-rxjs'
import { makeMatch } from 'ts-adt/MakeADT'
import { pipe } from 'fp-ts/lib/function'
import { Atom } from '@pfgray/molecule'

const matchTag = makeMatch('tag')

type CountAction =
  | { tag: 'increment' }
  | { tag: 'decrement' }
  | { tag: 'set', value: number }

export const counterSubject = new Subject<CountAction>()

counterSubject.next({ tag: 'increment' })

counterSubject.next({ tag: 'set', value: 5 })

const countAtom: Atom<number> = reducerFromActionStream(counterSubject)(0)((s, a) => pipe(a, matchTag({
  decrement: () => s - 1,
  increment: () => s + 1,
  set: s => s.value 
})))
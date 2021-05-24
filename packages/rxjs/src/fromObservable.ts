import { Observable } from 'rxjs'
import { makeAtom } from '@pfgray/molecule'

export const fromObservable = <A>(initial: A) => (observable: Observable<A>) => {
  const [update, atom] = makeAtom(initial)
  observable.subscribe(a => {
    update(() => a)
  })
  return atom
}
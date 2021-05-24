import { makeAtomReducer } from "@pfgray/molecule"
import { Observable } from "rxjs"


export const reducerFromActionStream = <A>(actionStream: Observable<A>) => <S>(initial: S) => (reducer: (state: S, action:A) => S) => {
  const [atom, dispatch] = makeAtomReducer<S>(initial)<A>(reducer)
  actionStream.subscribe(dispatch)
  return atom
}

export const reducerFromActionStreamC = <A>(actionStream: Observable<A>) => <S>(initial: S) => (reducer: (state: S) => (action:A) => S) => {
  const [atom, dispatch] = makeAtomReducer<S>(initial)<A>((s, a) => reducer(s)(a))
  actionStream.subscribe(dispatch)
  return atom
}


export const forActions = <A, S>(f: (a: A) => (s:S) => S) => (s: S, a: A) => f(a)(s)
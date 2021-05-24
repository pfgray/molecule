import { Atom, makeAtom } from "./atom"

type Dispatch<A, S> = (a: A) => () => S

type AtomReducerResult<A, S> = [
  Atom<S>,
  Dispatch<A, S>
]

export const makeAtomReducer = <S>(initialState: S) => <A>(reducer: (s: S, a: A) => S): AtomReducerResult<A, S> => {
  const [modify, atom] = makeAtom(initialState)
  const dispatch = (a: A) => 
    modify(s => reducer(s, a))
  return [
    atom,
    dispatch
  ]
}
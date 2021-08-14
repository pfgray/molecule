import { Atom } from "./atom";

export type Molecule<T, A> = [T, Atom<A>]

type SimpleMolecule<A> = Molecule<(f: (a:A) => A) => () => A, A>

export const makeMolecule = <A>(initial: A): SimpleMolecule<A> => {
  let state = initial
  let observers = new Map<symbol, (a: A) => void>()
  return [m => () => {
    state = m(state)
    observers.forEach(f => {
      f(state)
    })
    return state
  }, {
    observe: fa => {
      const id: unique symbol = Symbol();
      observers.set(id, fa);
      return () => {
        observers.delete(id)
      }
    },
    getValue: () => state
  }]
}

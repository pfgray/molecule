


export type Atom<A> = {
  observe: (f: (next: A) => void) => () => void,
  // onChange: (f: (prev: A, next: A) => void) => () => void,
  // modify: (f: (a:A) => A) => void
  getValue: () => A
}

export const makeAtom = <A>(initial: A): [(f: (a:A) => A) => () => A, Atom<A>] => {
  let state = initial
  let observers = new Map<symbol, (a: A) => void>()
  return [m =>  () => {
    state = m(state)
    observers.forEach(f => {
      f(state)
    })
    return state
  }, {
    observe: fa => {
      console.log('adding observer.........')
      const id: unique symbol = Symbol();
      observers.set(id, fa);
      return () => {
        console.log('deleting observer')
        observers.delete(id)
      }
    },
    getValue: () => state
  }]
}

export const map = <A, B>(ab: (a: A) => B) => (fa: Atom<A>): Atom<B> => {
  return {
    observe: (fb) => {
      return fa.observe(a => fb(ab(a)))
    },
    getValue: () => ab(fa.getValue())
  }
}

export const ap = <A, B>(fab: Atom<(a: A) => B>) => (fa: Atom<A>): Atom<B> => {
  return {
    observe: (fb) => {
      const unobserveFa = fa.observe(a => fb(fab.getValue()(a)))
      const unobserveFab = fab.observe(ab => fb(ab(fa.getValue())))
      return () => {
        unobserveFa()
        unobserveFab()
      }
    },
    getValue: () => fab.getValue()(fa.getValue())
  }
}



export type Molecule<A> = {
  observe: (f: (next: A) => void) => () => void,
  // onChange: (f: (prev: A, next: A) => void) => () => void,
  // modify: (f: (a:A) => A) => void
  getValue: () => A
}

export const makeMolecule = <A>(initial: A): [(f: (a:A) => A) => void, Molecule<A>] => {
  let state = initial
  let observers: Record<symbol, (a: A) => void> = {}
  return [m => {
    state = m(state)
    Object.keys(observers).forEach(key => {
      observers[key](state)
    })
  }, {
    observe: fa => {
      let id = Symbol();
      observers[id] = fa;
      return () => {
        delete observers[id]
      }
    },
    getValue: () => state
  }]
}

export const map = <A, B>(ab: (a: A) => B) => (fa: Molecule<A>): Molecule<B> => {
  return {
    observe: (fb) => {
      return fa.observe(a => fb(ab(a)))
    },
    getValue: () => ab(fa.getValue())
  }
}

export const ap = <A, B>(fab: Molecule<(a: A) => B>) => (fa: Molecule<A>): Molecule<B> => {
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
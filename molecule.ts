


type Molecule<A> = {
  observe: (f: (t: A) => void) => () => void,
  // modify: (f: (a:A) => A) => void
  getValue: () => A
}

const makeMolecule = <A>(initial: A): [(f: (a:A) => A) => void, Molecule<A>] => {
  let state = initial
  let observers: Record<symbol, (a: A) => void> = {}
  return [m => {
    state = m(state)
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

const map = <A, B>(fab: (a: A) => B) => (ma: Molecule<A>): Molecule<B> => {
  return {
    observe: (fb) => {
      return ma.observe(a => fb(fab(a)))
    },
    getValue: () => fab(ma.getValue())
  }
}
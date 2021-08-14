import * as React from 'react'
import { Atom } from '@pfgray/molecule'
import * as Eq from 'fp-ts/lib/Eq'

export const useAtom = <A>(a: Atom<A>, eq: Eq.Eq<A>) => {
  const [state, setState] = React.useState(a.getValue())
  React.useEffect(() => {
    return a.observe(nextState => {
      console.log('something else changed.......', state, nextState);
      if(!eq.equals(state, nextState)) {
        console.log('Setting state!', state, nextState)
        setState(nextState)
      }
    })
  }, [a, state])
  return state
}

export const makeUseLocalAtom = <Args extends any[], A>(f: (...args: Args) => Atom<A>, eq: Eq.Eq<A>) => (...args: Args) => {
  const a: Atom<A> = React.useMemo(() => f(...args), [])
  const [state, setState] = React.useState(a.getValue())

  React.useEffect(() => {
    return a.observe(nextState => {
      console.log('something else changed.......', state, nextState);
      if(!eq.equals(state, nextState)) {
        console.log('Setting state!', state, nextState)
        setState(nextState)
      }
    })
  }, [a, state])
  return state
}

export const bindAtom = <A, B extends A>(a: Atom<A>, eq: Eq.Eq<A>) => (component: React.Component<B>): React.FunctionComponent<Omit<B, keyof A>> => {
  return (restOfB: Omit<B, keyof A>) => {
    const aValue = useAtom(a, eq)
    return React.createElement(component as any, {...restOfB, ...aValue})
  }
}

export const atomComponent = <A>(a: Atom<A>, eq: Eq.Eq<A>) => (c: React.FunctionComponent<A>): React.FunctionComponent<{}> => {
  return () => {
    const aValue = useAtom(a, eq)
    return React.createElement(c, aValue)
  }
}
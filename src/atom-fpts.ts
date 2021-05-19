import * as F from 'fp-ts/Functor'
import * as Ap from 'fp-ts/Applicative'
import { makeAtom, map, ap, Atom } from './atom';
import { snd } from 'fp-ts/lib/ReadonlyTuple';


export const URI = "Molecule";
export type URI = typeof URI;

declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    Molecule: Atom<A>;
  }
}

export const Functor: F.Functor1<"Molecule"> = {
  URI,
  map: (fa, ab) => map(ab)(fa) 
}

export const Applicative: Ap.Applicative1<"Molecule"> = {
  ...Functor,
  of: a => snd(makeAtom(a)),
  ap: (fab, fa) => ap(fab)(fa)
}


import * as F from 'fp-ts/Functor'
import * as Ap from 'fp-ts/Applicative'
import { makeMolecule, map, ap, Molecule } from './molecule';
import { snd } from 'fp-ts/lib/ReadonlyTuple';


export const URI = "Molecule";
export type URI = typeof URI;

declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    Molecule: Molecule<A>;
  }
}

export const Functor: F.Functor1<"Molecule"> = {
  URI,
  map: (fa, ab) => map(ab)(fa) 
}

export const Applicative: Ap.Applicative1<"Molecule"> = {
  ...Functor,
  of: a => snd(makeMolecule(a)),
  ap: (fab, fa) => ap(fab)(fa)
}
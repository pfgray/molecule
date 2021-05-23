

import { Either, left, right } from 'fp-ts/lib/Either';
import { pipe, tuple } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as O from 'fp-ts/Option'
import { ADT, match } from 'ts-adt';
import { Atom, makeAtom } from '@pfgray/molecule'

export type AsyncState<E, A> = ADT<{
  pending: {},
  error: {error: E} ,
  success: { success: A },
  rerequesting: { value: Either<E, A> }
}>

const pending: AsyncState<never, never> = { _type: 'pending' }
const error = <E>(error: E): AsyncState<E, never> => ({_type: 'error', error })
const success = <A>(success: A): AsyncState<never, A> => ({_type: 'success', success })
const rerequesting = <E, A>(value: Either<E, A>): AsyncState<E, A> => ({_type: 'rerequesting', value})

export type AsyncMolecule<P extends Array<any>, R, E, A> = [
  fetch: (...p: P) => RTE.ReaderTaskEither<R, E, A>,
  atom: Atom<AsyncState<E, A>>
]

type InnerState<E, A> = [state: AsyncState<E, A>, latest: O.Option<Date>]

/**
 * Apply a modification, but only if the supplied date is more recent than the old one
 * @param dt 
 */
const ifDateMatches = <E, A>(dt: Date) => (f: (is: InnerState<E, A>) => InnerState<E, A>) => ([st, oldDate]: InnerState<E, A>): InnerState<E, A> =>
  pipe(
    oldDate,
    O.filter(old => old.getTime() <= dt.getTime()), // none if out of date
    O.fold(() => f([st, oldDate]), () => [st, oldDate])
  )

// export const remoteMolecule = <P extends Array<any>, R, E, A>(rte: (...p: P) => RTE.ReaderTaskEither<R, E, A>): AsyncMolecule<P, R, E, A> => {
//   const [modify, atom] = makeAtom<InnerState<E, A>>(tuple({_type: 'pending' as const}, O.none))

//   const now = new Date()

//   // modify the state
//   const fetch = (...p: P): RTE.ReaderTaskEither<R, E, A> =>
//     pipe(
//       () => modify(([st]) =>
//         pipe(
//           st,
//           match({
//             pending: () => tuple(st, O.some(now)),
//             error: e => tuple(rerequesting(left(e.error)), O.some(now)),
//             success: s => tuple(rerequesting(right(s.success)), O.some(now)),
//             rerequesting: () => tuple(st, O.some(now))
//           })
//         )
//       ),
//       io => RTE.fromIO<R, E, InnerState<E, A>>(io),
//       RTE.chainW(() => rte(...p)),
//       RTE.chainFirstIOK(
//         (result) => () => modify(
//           ifDateMatches<E, A>(now)(([st, dt]) =>
//             pipe(
//               st,
//               match({
//                 pending: () => tuple(success(result), O.some(now)),
//                 error: e => tuple(success(result), O.some(now)),
//                 success: s => tuple(success(result), O.some(now)),
//                 rerequesting: () => tuple(success(result), O.some(now))
//               })
//             )
//           )
//         )
//       )
//     )
//   return tuple(fetch, atom)
  
// }
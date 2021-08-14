import { makeAtom } from "@pfgray/molecule"





const makeForm = <A extends Record<string, unknown>>(initialState: A) => {
  
  const values = Object.entries(initialState).map(([k, v]) => ([k, {value: v, dirty: false}]))

  // const [update, state] = makeAtom({
  //   values: 
  // })
  
}



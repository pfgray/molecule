
## Atom

The core of this abstraction is the `Atom`. It is essentially an `Observable`, except that it always has a "current" value (Observables are merely streams of data, but it's possible you'd never have an initial value to begin with!).

The `Atom` interface even uses the same method name for `observe`, except that it additionally has a `getValue` method, which returns the current value inside the `Atom`.

```ts
type Atom<A> = {
  observe: (f: (a: A) => void) => void
  getValue: () => A
}
```

Each `Atom` holds a value `A` inside. You can react to changes in the enclosed value by calling the `observe` function, and passing a callback. This callback will called anytime the value inside the `Atom` changes, with the new value. 


### Making an Atom

You can make an `Atom` by calling the `makeAtom` function and supplying an initial value:

```ts
const [modifyCount, count] = makeAtom(0)

count // Atom<number>
modifyCount // (f: (a: number) => number) => number
```

Here, we're making an `Atom` that will store a counter, and thus its type is `Atom<number>`. From `makeAtom`, we get a `modifyCount` function, and a `count` atom. The `modifyCount` function can be used to update the value inside the atom.


```ts
const [modifyCount, count] = makeAtom(0)

count.getValue() // 0

count.observe(c => {
  console.log('Got new value: ', c)
})

modifyCount(c => c + 1)
// Got new value: 1
modifyCount(c => c + 2)
// Got new value: 3
```


## Usage with React:

The `useAtom` hook allows you to subscribe to values inside of `Atom`s

```tsx
const CountDisplay = () => {
  const clickCount = useAtom(count)

  return <div>You have clicked {clickCount} times!</div>
}
```

The freestanding `modifyCount` function can be imported and used anywhere to update the value inside the `count` atom.


```tsx
const CountClicker = () => {
  return <button onClick={() => modifyCount(c => c + 1)}>Click to add a click!</button>
}
```

When the `modifyCount` function is invoked, the state in `CountDisplay` will automatically update with the new value.

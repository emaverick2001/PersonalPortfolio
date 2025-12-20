---
title: TypeScript's elusive never[] type
publishDate: 2023-09-21
description: Exploring type theory through TypeScript type inference
---

This TypeScript code results in an error.

```ts
const obj = { items: [] }
obj.items = ["foo"]
// error: Type 'string' is not assignable to type 'never'.
```

This happens because the type of `items` is inferred as `never[]`.

But why would the array be of type `never[]`, and what does that even mean?

In searching for an answer, I came across many articles online about
TypeScript’s `never` type. They usually cover basic concepts (`never` inferred
from a function, how to use `never` for exhaustive checks), but I found a gap in
content explaining how you might end up with an array of type `never[]`. This
article aims to fill that gap.

By the way, this article assumes we’re discussing TypeScript in strict mode.

## The `never` type

Okay, so first off, what’s the `never` type?

Formally, it's the [bottom type](https://en.wikipedia.org/wiki/Bottom_type) from
type theory. In practice, all you really need to know about `never` is that:

- `never` is the type of values that should _never_ happen.
- `never` is a subtype of every type, and is assignable to every type.

### Values that should never happen

#### Functions that never return

```ts
// These functions have type: () => never

const foo = () => {
  while (true) {}
}

const bar = () => {
  throw Error()
}
```

<figcaption>

Note: I used function expressions for these examples because function
declarations don’t infer `never` in the same way. Read [this GitHub
issue](https://github.com/microsoft/TypeScript/pull/8767) if you’re curious.

</figcaption>

The return type of these functions is `never`. Note that this is not the same as
`void`: a `void` function returns, but doesn’t explicitly return a value. A
`never` function doesn’t return at all.

Another example:

#### A type which has been narrowed down to nothing

```ts
function baz(param: string) {
  if (typeof param === "string") {
    // param has type "string" in this branch.
  } else {
    // param has type "never" in this branch.
  }
}
```

There are some cool things you can do with this, such as [exhaustive
checks](https://basarat.gitbook.io/typescript/type-system/discriminated-unions#exhaustive-checks). I won't go over that here so that we can get to how this relates to `never[]`.

### A subtype of every type: assignable to every type

`never` is a subtype of every type, in the same way `string` is a subtype of
`string | number`. Just like you can assign a `string` value to a variable of
type `string | number`, you can assign `never` to every other type, because it's
a subtype of every type.

```ts
// No error here - `string` is more specific than `string | number`, so a
// `string` can fit inside `string | number`
const myString: string = "foo"
const myUnion: string | number = myString

// Similarly, `never` is assignable to every other type:

// Function with return type `never`
const x = () => {
  while (true) {}
}

// No error here: the call to `x` returns `never`, which is assignable to
// every other type, such as `number`.
const y: number = x()
```

To think about this more mathematically, use sets. `string` is a subset of
`string | number`. `never`, the empty set, is a subset of all other sets.

Sure - now how does this relate to `never[]`?

## The `never[]` type

What type should TypeScript infer an empty array literal to be?

```ts
const arr = []
// arr is of type `any[]`
```

When you try this out, you'll see that it's `any[]` here. However, it's not
really `any[]`, it's actually an [evolving array](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#improved-any-inference).
We'll skip over evolving array because they're a special case. What type would the array be if it wasn't an evolving array?

We can check with an object property - these don't use evolving arrays:

```ts
const obj = { items = [] }
// obj.items is of type `never[]`
```

Why `never[]`? Let's try using it.

```ts
function foo(x: number[]) {
  // ...
}

foo([]) // What type does [] need to be for this call to succeed?
```

TypeScript doesn't know what type the elements of your array would be, but still
needs to infer the type. What type should it infer?

How about `unknown[]`? If you're not familiar with `unknown`, you can read about
it
[here](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown).
In short, it's opposite of `never` - `unknown` is the top type, the supertype of
all other types.

Well that won't work. `unknown`, being the top type, isn't assignable to
anything, so our call to `foo([])` would fail - `unknown[]` isn't assignable to
`number[]`.

How about `any[]`? In strict mode with `noImplicitAny`, TypeScript avoids
inferring values as `any`, so this won't work either.

For our empty array to succeed in this case, we need it to be a type which is
assignable to any other type. Our only option, then, is for the empty array to
be inferred as `never[]`.

Cool, `never[]` makes sense in this example. However, let's revisit our original
example:

```ts
const obj = { items: [] }
obj.items = ["foo"]
// error: Type 'string' is not assignable to type 'never'.
```

What do we do about this?

`never[]` makes sense when you're trying to infer a value that needs to be
assignable to anything, but less sense when you end up with `never[]` on a
variable you intend to use.

## The solution

Notice that this is only a problem with inference: TypeScript doesn't have
enough information to correctly infer what elements you're going to put into
your array. The solution, then, is to give it more context by helping it out
with an explicit type.

With a type assertion:

```ts
const obj = { items: [] as string[] }
obj.items = ["foo"]
```

You could also use a separate type:

```ts
type ItemObject = {
  items: string[]
}

const obj: ItemObject = { items: [] }
obj.items = ["foo"]
// No error - problem solved!
```

Either way, the idea is to give TypeScript more information about what type your
array should be.

For the React devs out there, here's an pattern you might be familiar with:

```ts
const [foo, setFoo] = useState([])
// type is inferred as `never[]`

// Later...
const newItem = "bar"
setFoo([...foo, newItem])
// Oops! `string` is not assignable to `never`
```

useState is generic: specify the type instead of leaving it up to inference:

```ts
const [foo, setFoo] = useState<string[]>([])
// type is explicitly annotated as `string[]`

// Later...
const newItem = "bar"
setFoo([...foo, newItem])
// No errors here!
```

## Summary

Empty arrays are inferred to be `never[]` (unless they're an evolving array).

This works because `never` has the property that it's assignable to everything -
for cases where you're using an inline empty array literal, this works great.

However, when `never[]` leaks into the rest of your program, it's much more
difficult to work with.

This is a problem with inference: you can solve this by explicitly specifying
a type.

---

## Sources and further reading

[The pull request which originally introduced `never` to
TypeScript](https://github.com/Microsoft/TypeScript/pull/8652)

[TypeScript release notes for the `never`
type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#the-never-type)

[Some type theory, specifically regarding the bottom
type](https://wiki.c2.com/?BottomType)

[More on the `never` type from Basarat's TypeScript Deep
Dive](https://basarat.gitbook.io/typescript/type-system/never)

[StackOverflow post discussing motivations behind the `never`
type](https://stackoverflow.com/questions/49219531/why-was-the-never-type-introduced-in-typescript/49225093#49225093)

[Resource covering `never` and `unknown`. Has good diagrams and gets more into
type theory](https://blog.logrocket.com/when-to-use-never-unknown-typescript/)

[Comment from Ryan Cavanaugh, development team lead for the TypeScript team,
explaining design challenges around empty array
inference](https://github.com/microsoft/TypeScript/issues/51853#issuecomment-1347740712)

[TypeScript design meeting notes discussing issues with
`never[]`](https://github.com/microsoft/TypeScript/issues/51898)

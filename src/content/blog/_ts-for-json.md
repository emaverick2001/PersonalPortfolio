---
title: Why TS/JS is great for JSON
author: Debashis Biswas
tagline: You can't escape JavaScript (this time, because of JSON).
publishDate: 2023-09-26
---

A few months ago, I had to write a data migration tool at work. There were some
database and endpoint calls mixed in, but the core of the task involved mapping
one JSON format to another. This wasn't a simple "just map the key names"
mapping - there were some structural transformations as well.

Being a quick, short-lived script, I completed the task in Python. If I had to
do something similar again, I'd use TypeScript.

But why? Nearly all modern languages have options for good JSON support, why not
use a language more well-suited for scripting?

The short answer is: JSON (**J**ava**S**cript **O**bject **N**otation), being
derived from JavaScript objects, inherits some of JavaScript's quirks. Dealing
with these quirks in JavaScript is easier than in other languages.

Here's the longer answer.

TODO: here, introduce the part of the task you want to discuss. mainly, the
mapping aspect. this way, you can set up your explanation to highlight the
benefit of having `undefined` as a value you can pass around. representing
potential states as values (undefined is a value, rather than a special case to
handle. link to errors as values, which Golang does, for a similar concept)

## Two states of null

If you've done some JSON parsing, you've likely run into this problem: JSON has
two ways to represent a "null" field:

- The field is present, and has a value of `null`
- The field isn't present

For example, this:

```json
{
  "first": "Debashis",
  "middle": null,
  "last": "Biswas"
}
```

is different than:

```json
{
  "first": "Debashis",
  "last": "Biswas"
}
```

TODO: bottom values
Wait, that sounds familar. Reminds me of JavaScript's notorious issue of having
two bottom values: both `null` and `undefined`.

Actually, that's exactly what this is. In JavaScript, if an object doesn't have
a certain key, it's `undefined`. If it does have a value, it can be `null`. This
is annoying in many cases, but works particularly well for JSON:

```js
const foo = { first: "Debashis", middle: null, last: "Biswas" }
console.log(JSON.stringify(foo)) // {"first":"Debashis","middle":null,"last":"Biswas"}

const bar = { first: "Debashis", middle: undefined, last: "Biswas" }
console.log(JSON.stringify(bar)) // {"first":"Debashis","last":"Biswas"}

// same as "bar"
const baz = { first: "Debashis", last: "Biswas" }
console.log(JSON.stringify(baz)) // {"first":"Debashis","last":"Biswas"}
```

In TypeScript, here's a type that could handle all three of these:

```ts
type User = {
  first: string;
  middle?: string | null;
  last: string;
}
```

Here, the resulting type of `middle` is `string | null | undefined`, which you
could write explicitly if you'd prefer.

The point here is that having a representation of both of these states at the
type level makes it much easier to handle both cases. Here are a few examples:

TODO: transferring undefined
```ts
function example(user: User): void {
  // != handles both null and undefined
  if (user.middle != null) {
    // here, user.middle is a string
  }

  // or, handle just undefined by explicitly checking undefined with !==
  if (user.middle !== undefined) {
    // here, user.middle is string | null
  }

  // Using ??, we can provide a default value in cases of null or undefined
  const middleName: string = user.middle ?? ""
}
```

## How about Python?

Sure, but other languages have good JSON support - does this really make a
difference?

Let's look at Python.

How would a null value be handled?

```py
import json

json_with_null = '{"first":"Debashis","middle":null,"last":"Biswas"}'
dict_with_null = json.loads(json_with_null)
print(dict_with_null["middle"])
# prints "None"
```

Cool, Python has `None`, which can represent null. How about a missing key?

```py
import json

json_with_missing_key = '{"first":"Debashis","last":"Biswas"}'
dict_with_missing_key = json.loads(json_with_missing_key)
print(dict_with_missing_key["middle"])
# Oops! Raises "KeyError"
```

Here, we get a different behavior. In JavaScript, a missing key on an object
would have returned `undefined`, but a Python dictionary raises a `KeyError`.

Following the Python pattern of "ask for forgiveness, not permission", we can
handle the error:

```py
try:
  print(dict_with_missing_key["middle"]) # will print actual value, or None
except KeyError:
  print("No middle name")
```

Or we could check for the key:

```py
if "middle" in dict_with_missing_key:
  print(dict_with_missing_key["middle"]) # will print actual value, or None
else:
  print("No middle name")
```

Or we could use the `get` function provided by dictionaries:

```py
# will fall back to an empty string if the key doesn't exist
dict_with_missing_key.get("middle", "")
```

Okay, not too bad. If you have a nested object, however:

```py
dict_with_nested_object
  .get("nested", {}) # fall back to empty dict
  .get("value", None) # fall back to None
```

or if you want some help from your static checker with TypedDict:

```py
from typing import TypedDict, Optional

class User(TypedDict):
    first: str
    middle: NotRequired[Optional[str]]
    last: str
```

// TODO: greater emphasis on nested objects

rest of the outline
- okay so you don't like javascript or python. rust example
- it goes on. golang, java. the point is that this happens when you try to map
JavaScript's quirks into other languages
- JS is the best language to deal with JSON for this reason

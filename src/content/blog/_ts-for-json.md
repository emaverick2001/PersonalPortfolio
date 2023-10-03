---
title: Why JavaScript is great for JSON
author: Debashis Biswas
tagline: You can't escape JavaScript (this time, because of JSON).
publishDate: 2023-09-26
---

A few months ago, I had to write a data migration tool at work. There were some
database and endpoint calls mixed in, but the core of the task involved mapping
one JSON format to another. This wasn't a simple "just map the key names"
mapping - there were some structural transformations as well.

Being a quick, short-lived script, I completed the task in Python. If I had to
do something similar again, I'd use JavaScript. Well, TypeScript, but you know
what I mean - I'll just call it JavaScript here.

But why? Most languages have built-in JSON support, so does it really matter
which language you use?

In most cases, no. I don't think it really matters. Usually, using whichever
JSON tooling your language offers will be good enough. However, because the tool
I wrote primarily dealt with JSON, there were a few situations in which I wished
I had used JavaScript instead.

## It's in the name

JSON, or **J**ava**S**cript **O**bject **N**otation, is derived from
JavaScript's objects. What does this mean for you? They share a lot of
similarities, giving you less to think about when you're converting between the
two. Here are a few examples that came up in my project.

## Mapping types

The first problem you'll likely run into when you're parsing JSON is that you
need to know how your language's types map onto JSON's types.

There's little conversion to be done if you're working in JavaScript, but in
Python, you have to know that a dictionary maps to an object, `None` maps to
`null`, how the parser handle integers and floats, etc. In statically-typed
languages, you need to think more about how to handle null keys and optional
keys - maybe your language doesn't have a way to represent this distinction.
This isn't that difficult, and it's useful to know how your language of choice
handles these things. However, when you're using JavaScript, it's one less thing
to think about.

## null keys and optional keys

## It fits will in the type system

## use bun or deno

---
title: Where did we go wrong?
author: Debashis Biswas
tagline: Musings on how we've overcomplicated easy problems
publishDate: 2023-10-20
---

Matt Pocock, a well-known TypeScript wizard, recently released a
[video](https://youtu.be/uiOJ5_7cB4I?si=pdh31CjquqUwUUIy) covering what type
props should be for a React component which be either a button or anchor tag.
The video is titled "Rethink your life choices before you do this...", so by the
end, his recommendation is to avoid this pattern - just make two separate
components.

But even though it wasn't his recommendation, I still have to wonder: how did we get
to a point in web development in which something like:

```ts
import React from "react";

type ButtonOrLinkProps =
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
      as?: "button";
    })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      as: "a";
    });

const ButtonOrLink = (props: ButtonOrLinkProps) => {
  if (props.as === "a") {
    return <a {...props} />;
  }
  return <button {...props} />;
};
```

is a reasonable option when trying to display a button on a page?

Let's try follow the thought process.

If you've done frontend using a component-based framework, you've likely come
across the problem he's describing. Your page will have `<button>` and `<a>`
tags for different purposes, but sometimes, you have anchor tags that look like
buttons.

We've all been raised on DRY, so we make a component which can be either a
button or anchor tag, and specify the styles in the component. This way, you
specify button styles in one place. Single source of truth for your
button styles, regardless of if they're a button or anchor tag on the page. DRY
achieved.

But what type should our component's props be? If the component can be either a
button or anchor tag, then when it's a button, it should be the type of a
`<button>`'s attributes - and same for the anchor.

So, we end up with the code snippet above: the "as" prop pattern. We have to
provide some information to allow TypeScript to narrow the type down to the one
we want.

But like Matt recommended, we could, alternatively, just make two components.

Because if we already know which element we want at the callsite...

```html
<ButtonOrLink as="a" href="/" />
<ButtonOrLink as="button" />
```

then couldn't we just specify the component instead?

```html
<Link href="/" />
<Button />
```

or... couldn't we just use...

```html
<a href="/" />
<button />
```

Great! Now, we need to share some styles between elements. How about...

```html
<a href="/" class="btn" />
<button class="btn" />
```

<figcaption>

or `className`, if you're still in react

</figcaption>

Looks fine. Two components, or simply two HTML tags, seems like the move, right?

Not quite. There's another strong reason why you might want both elements in one
component - you're using Tailwind.

Following Tailwind's approach, we wouldn't use a CSS class here to reuse the
style. To reuse the style, we need to wrap it in a component - so for this
case, the button and anchor tag should be handled by the same component, which
encapsulates the style.

This is because Tailwind strongly recommends against using CSS classes. Instead,
they recommend [reusing styles by encapsulating utility classes in a
component](https://tailwindcss.com/docs/reusing-styles#extracting-components-and-partials).
There are some [good arguments for
this](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/),
and in most cases, I find that Tailwind's approach works well.

It works because you're grouping styles and markup together, while enforcing
your design constraints by sticking with Tailwind's classes.

This keeps everything in one place: if you need to change the markup,
you go to the component. Need to change the styles? Go to the same component,
rather than a distant CSS class that's reused project-wide and could break
something if you change it.

However, the button/anchor problem is specifically one in which we don't want to
group styles with our markup. We want a style that we can use on different types
of markup.

A group of styles... independent of markup...

Oh, like a CSS class?

As a Tailwind user, you have two options here. Dogmatically follow Tailwind's
approach and use the code snippet above, or use a CSS class for this one
exception.

To get back to the original point of the article - this is how we ended up here.
We placed a bunch of artificial constraints on ourselves, and then back ourselves
into a corner, requiring us to build weird workarounds like the code snippet at
the beginning of this article.

This happens often with abstractions. They make some things easier, yet some
things much more complicated - sometimes, we need the built-in capabilities of
the thing we meant to abstract away. [ORMs are another place where you can see
this](https://effectivetypescript.com/2023/08/29/sql/).

So, to answer the original question: how did we get to a place where that code
snippet seems reasonable? By deciding that typesafety and utility classes are
the way to build frontends for the way. Like all things, they come with
tradeoffs, and in the future, it'll be easier to judge whether the tradeoffs
were worth it.

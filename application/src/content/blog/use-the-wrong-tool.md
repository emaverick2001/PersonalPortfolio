---
title: Use the wrong tool for the job
publishDate: 2024-11-05
image: "/assets/images/wrongTool.jpg"
description: Limiting perfectionism
categories: ["Reflection"]
---

Use the wrong tool for the job?

_No one would say that, right?_

Then why do we keep repeating "use the right tool for the job", as if it wasn't
already the obvious choice?

"Use the right tool for the job" is too subjective. It's too vague. For this
reason, it feels like "vague dogma": it makes you _sound_ like you're being
pragmatic, so it keeps getting repeated - but in reality, it's so vague that it
ends up getting twisted into whatever definition is most beneficial in the
context it's brought up in.

It's true that different tools fit certain jobs well. But _how do you determine
what the right tool is?_

"Use the right tool for job" implies that certain jobs have specific tools that
are a perfect fit. That there's a "best" tool for the job, and that's the one
you should be using.

But sometimes, you should use the tool you're already using. This is [John
Carmack&#39;s advice](https://x.com/ID_AA_Carmack/status/989951283900514304):

> The right tool for the job is often the tool you are already using -- adding
> new tools has a higher cost than many people appreciate.

Earlier in my career, I helped a small startup build a desktop application for
Windows to visualize streaming signal data. Thinking I should use the right tool
for the job, I wrote it in WPF - a framework I had no experience in. A framework
for building applications which - I didn't know at the time - is known for a
ridiculously high learning curve. I chose WPF because for writing a Windows
desktop application because, well, wouldn't the native platform be the "correct"
tool to use?

It took me far too long to get anything useful done, because I spent all my time
trying to figure out WPF specifics. A more pragmatic option in this scenario
would have been to use something like Electron, taking advantage of the years of
web experience I already had. Electron may have some theoretical issues, but in
practice, it would have allowed me to solve the startup's problem most
effectively. They wouldn't have cared about the larger bundle size.

In short, I had tried to "use the right tool for the job", but it turns out,
that advice is too vague to be applied generally.

The idea that you should use the tool that's theoretically the best is, again,
missing the context of the rest of the decision-making process. Sometimes...

- You already have existing infrastructure around your existing tools.
- It's not a good fit for your team's experience and interest.
- It's difficult to hire people for down the road.
- It has too high a learning curve for the time you have allotted.

This idea reminds me of the decision to choose Rust for your project. The type
system makes it seem like it's theoretically the "best" for some things, but
this doesn't take into account the learning curve, the development speed, and
the context of what you're actually working on. I love Rust, but I know that
there are projects where it would be irresponsible to reach for it.

Of course, that's not to say that you shouldn't improve your processes, learn
difficult things, or use new tools. That's how progress is made. The decision to
do so, however, should be made considering the surrounding context. Change takes
time.

In general, this idea of "vague dogma" comes from advice that tells you what to
do, rather than how to do it. The original advice was formulated from someone's
experience, but with time, we lose the context of that underlying experience. We
are left only with the conclusion - a conclusion that means little outside of
the context it was created in.

Contrast these two pieces of advice. "Protect your time", and, "Be wary of
commitments that add overhead in the form of meetings on your calendar".

- The first tells you _what_ to do, and can be treated and applied dogmatically
  with whatever interpretation suits you.
- The second tells you _how_ to protect your time, providing clear criteria to
  consider.

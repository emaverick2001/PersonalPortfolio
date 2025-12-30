---
title: Conjuring tools
publishDate: 2025-03-24
description: Using LLMs to create tools on demand feels like spellcasting
image: "/assets/images/conjuringTools.jpg"
categories: ["Reflection"]
---

Using LLMs to create small, purpose-built tools makes me feel like I'm casting
spells.

There are so many ways to get value out of LLMs, and the one I keep finding
myself landing on while working in software is using them to create small tools
as I work on larger problems.

For example, I recently optimized a legacy data import program. The program was
parsing a specialized file format with about two million data points and
uploading the data into our database. The data import was taking six hours, and
after working at it for a week, I was able to get it down to two minutes.
Throughout the process, I often wished for small tools that would help me
investigate smaller parts of the problem. These were tools I could write, but
that would have normally required a long detour. AI was quite helpful for
creating these tools quickly:

- A script to benchmark database inserts: without batching, with batching,
  connection pooling, different batch sizes, and a nice report comparing
  performance characteristics of each approach
- A script to compare database schemas: do they have the same tables? If not,
  which are different? Do columns match between the tables? Does each table have
  the same data?

The first script helped me quickly find that the performance bottleneck was
actually in parsing the file, rather than network latency while uploading to the
database. It also helped me a find a good batch size. The second helped me
automatically test that the changes I was making only changed the performance of
the tool, and not the behavior of the data import.

AI didn't solve the whole problem, but it allowed me to conjure purpose-built
tools to get faster feedback and test out my ideas while I was working towards a
solution! I felt like a spellcaster with the power at my fingertips to summon
exactly what I needed.

This idea reminds me of "bound weapons" in Skyrim. In Skyrim, there are a set of
spells that allow a magic user to conjure a weapon at will. [Here's a video
demonstration](https://youtu.be/XGAJ8Jc1KM8). I always thought this spell was
facinating. The implication is that the magic user summons a tool that's exactly
fit for their hand, and exactly tailored to their preferences. LLMs offer me a
similar magic.

While we're talking about spellcasting, I'll leave this off with an excerpt from
[Structure and Interpretation of Computer
Programs](https://sarabander.github.io/sicp/html/index.xhtml).

> Computational processes are abstract beings that inhabit computers. As they
> evolve, processes manipulate other abstract things called **data**. The
> evolution of a process is directed by a pattern of rules called a **program**.

> People create programs to direct processes. In effect, we conjure the spirits
> of the computer with our spells.

> A computational process is indeed much like a sorcerer’s idea of a spirit. It
> cannot be seen or touched. It is not composed of matter at all. However, it is
> very real. It can perform intellectual work. It can answer questions. It can
> affect the world by disbursing money at a bank or by controlling a robot arm
> in a factory. The programs we use to conjure processes are like a sorcerer’s
> spells. They are carefully composed from symbolic expressions in arcane and
> esoteric **programming languages** that prescribe the tasks we want our
> processes to perform.

## Related

- [Co-Intelligence](https://www.goodreads.com/book/show/198678736-co-intelligence) - Ethan Mollick
- [Surely not all code's worth it](https://registerspill.thorstenball.com/p/surely-not-all-codes-worth-it) - Thorsten Ball

---
title: Obsidian and the beauty of plain text
publishDate: 2024-11-05
---

I've been thinking about the software design of Obsidian recently.

Consider tags: they're just text. A `#` followed immediately by some characters.
This feature doesn't exist in markdown, but Obsidian is able to quickly
autocomplete, list, and search the tags in your markdown files. Links behave
similarly. They're indexed locally, so that every single operation doesn't
require a full-text search of all of your data.

In this way, Obsidian's client doesn't own the data's format - it only provides
tools for working with the data's _semantics_. Your data is in markdown, and
Obsidian's client offers some progressive enhancements on top of that markdown
which offer some nice features. Opting for plugins adds more of these features. 

But you still own the data, as it's in plain text. You can sync or back up the
data yourself. You can version it in Git if you'd like. You can use it with any
tools that are built for processing text - Unix tools are great at this.

Most software in this space couples the data format with the data's semantics.
Sometimes, this means your data is locked in a proprietary data format. In other
cases, this means the software must be used online through a web client. This is
often necessary because they're taking advantage of the semantics offered by a
specific format: for example, Notion's core functionality is likely built on top
of the features of a relational database. However, tooling like [Turso's
embedded replicas](https://docs.turso.tech/features/embedded-replicas), and
other tooling in the local-first space, is starting to challenge the idea that
we can't have this power locally.

Tools built for the web also make it easy to support mobile clients, as the
application will run in most environments with a browser.

The alternative to implementing data semantics on a server is pre-processing
the data on the client: indexing the files in your project to improve search
speed, or in the case of Obsidian, enumerating links and tags. I started
thinking about this after seeing part of rwxrob's zettlekasten, and what looks
to be indexed data: an enumeration of all of the tags available in his notes.
[zet/docs/dex](https://github.com/rwxrob/zet/tree/908e1f6c18862fb73c3e267b3b80033651191002/docs/dex)

The trade-off of this approach is that your clients all must match. They must
implement semantics in the same way, which would normally be solved by
centralizing the logic behind your server, or behind some bespoke desktop
client. With web tooling, I wonder how much this issue is solved, as lots of
client code can be shared if everything is built with a web stack.

In order to keep your data accessible on many clients, Obsidian happens to offer
a nice sync server, which pairs nicely with the fact that they have good clients
for both desktop and mobile. The differentiation here is that the sync solution
has nothing to do with your data - they're basically just offering a bespoke
file sync engine that has official support within their client. This means that
it's optional, and tools like Dropbox and Syncthing can be used to a similar
end, though they won't integrate as nicely with the client.

Couple this with the fact that Obsidian is based on a _standard_ plain text
format, rather than a one constrained to a specific tool, (Emacs org, for
example), and you end up with something really nice - there's already a lot of
existing tooling around markdown files. Markdown takes advantage of a large,
existing ecosystem, and the benefits bleed over from anywhere else markdown is
used. For example, you can take markdown and turn it directly in a blog using
many existing tools.

What would it look like to build more applications around plain text? What would
our tooling look like? Standard utilities to index files on a certain pattern, a
method of querying… would it look like Emacs? Neovim? Do we already have it in
Unix?

Tools that work local plain text, offer a facility for extension, and provide a
means of distributing those extensions is an unstoppable combination.

## Related

- [Emacs Org Mode and the power of plain
text](https://sachachua.com/blog/2015/03/emacs-org-mode-power-plain-text/)
- [Local-first software: You own your data, in spite of the
cloud](https://www.inkandswitch.com/local-first/)

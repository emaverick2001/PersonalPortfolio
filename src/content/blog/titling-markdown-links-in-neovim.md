---
title: Titling Markdown links in Neovim
publishDate: 2024-09-12
---

Often, when I'm writing Markdown in Neovim, I want to automatically fetch a
link's title. This is a workflow I've had in [Obsidian](https://obsidian.md)
using the [Auto Link Title](https://github.com/zolrath/obsidian-auto-link-title)
plugin.

Let's say I have the following URL in my Markdown file:
`https://thesephist.com/posts/tools/`

I want to place my cursor on the URL, and with a single shortcut, fetch the
page's title and change it to a Markdown link, ending up with:

`[Build tools around workflows, not workflows around tools | thesephist.com](https://thesephist.com/posts/tools/)`

Inspired by [The Art of Unix
Programming](http://www.catb.org/~esr/writings/taoup/html/) and [this video by
rwxrob](https://youtu.be/-RqoPoOQd7w), I wanted to see how minimal I could
make the solution.

## Solving the core with a shell script

The core behavior behind my idea was simple - input: URL, output: page title.

I wrote a quick shell script to do just that. I added this to my path, called it
`web-title.sh`, and made it executable.

```sh
curl -Ls "$1" | grep -oP '(?<=<title>).*?(?=</title>)' | head -n 1
```

In summary, fetch the URL passed in as an argument with `curl`. Follow redirects
(`-L`) and run silently, only returning the result without any status-related
output (`-s`).

Pipe that into `grep` to search for the `<title>` tag, and use regex lookbehind
and lookahead to find the tag while only matching the content. Search lazily to
avoid getting more content than just the inside of the title tag (my own website
happened to have two title tags by accident, providing the wrong output with a
greedy match!)

If, for some reason, there happens to be multiple matches (like on my website,
which had two title tags...), only return the first one: `head -n 1`.

This works well, and is quite fast. Other approaches I've seen usually involve
parsing the whole DOM just to get the title, which takes more time than
necessary for this particular task.

## Handling an unexpected edge case 

Wait, but there's a subtle edge case: the result could be HTML encoded. I
happened to test my script on the music I was listening to at the time -
https://youtu.be/_QU9w_TLWO8 - and got back:

```
031 &quot;Whispering Summit&quot; // 1 Hour Ambience - YouTube
```

So close.

URL decoding could have been a huge rabbit hole, but for most cases, a minimal
solution will work. To handle this, I borrowed some logic from [this
webpage](https://stackoverflow.com/questions/5929492/bash-script-to-convert-from-html-entities-to-characters),
turned it into a script I could pipe into, and called it `htmldecode.sh`:

```sh
while read line; do
  echo $line | sed '
      s/&nbsp;/ /g;
      s/&amp;/\&/g;
      s/&lt;/\</g;
      s/&gt;/\>/g;
      s/&quot;/\"/g;
      s/#&#39;/\'"'"'/g;
      s/&ldquo;/\"/g;
      s/&rdquo;/\"/g;
  '
done
```

In short, this script uses `sed` to replace patterns - for example, every
`&quot;` is replaced with `;`, etc.

With this change, I can fix my original script with a single pipe:

```sh
curl -Ls "$1" | grep -oP '(?<=<title>).*?(?=</title>)' | head -n 1 | htmldecode.sh
```

This is great. While my HTML decoding logic may not be complete yet, it's so
simple that I can add any missing pieces as they come up. I can also reuse this
logic in other scripts I may write in the future, and if I add more URL decoding
patterns here, they'll all get the benefit. UNIX is fantastic.

## Plugging it into Neovim

The last piece is to be able to call this from Neovim. Here's what I ended up
with, with some comments explaining each piece. This file is in my Neovim config
at `after/ftplugin/markdown.lua`, which means my keymap is only registered when
I'm in a Markdown buffer. There's likely a simpler solution, but I haven't
figured it out yet.

```lua
local function add_title_to_url()
  -- Get the current WORD under the cursor: sequence of non-blank characters
  local url = vim.fn.expand('<cWORD>')

  -- Verify that the word is a URL
  if not url:match "^http" then
    print("cursor is not on a url: " .. url)
    return
  end

  -- Get the position of the URL in the buffer.
  -- The row will be the row the cursor is currently on...
  local row, _ = unpack(vim.api.nvim_win_get_cursor(0))
  -- ...and we can match the string to find the start and end columns.
  local start_col, end_col = string.find(vim.api.nvim_get_current_line(), vim.pesc(url))

  -- Technically, these could be nil, so check first.
  if start_col and end_col then
    -- Get the page title using the shell script, and replace any newlines.
    local title = vim.fn.system({ "web-title.sh", url }):gsub("[\n\r]", "")

    -- Format the title and URL for Markdown.
    local markdown_link = ("[%s](%s)"):format(title, url)

    -- Replace the URL in the buffer with the formatted link, and work around the
    -- fact that Lua is one-based
    vim.api.nvim_buf_set_text(0, row - 1, start_col - 1, row - 1, end_col, { markdown_link })
  end
end

-- Register the function with a keybind on my <localleader> - thanks to
-- Doom Emacs for this idea!
vim.keymap.set('n', '<localleader>at', add_title_to_url, { desc = "add title to url" })
```

## It works!

![demo](./markdown-link-demo.gif)

It's nice having the freedom to program my editor in this way, though I found
the roughest part of this to be Neovim. There are still some quirks around the
Neovim API - for example, `vim.system` vs `vim.fn.system`, a divide between
supported functionality in 0.9 vs 0.10, and Lua using one-based indexes while
the surrounding APIs are zero-based.

I wonder if I would have been better served trying to do this in a "classical
vim" fashion, which may have fit more cleanly with the Unix approach I was
trying to take. As much as I'm enjoying Neovim, I feel that the way it
approaches things is not as "close to the shell" as vim. For me, the entire
point of using a terminal-based editor is to be close to the shell to take full
advantage of the variety of tools it offers.

I also find that Neovim and vim features have low discoverability - it's not
always easy to find what you're looking for in the manual. It's also a bit
awkward to quickly iterate and debug while you're working on functionality like
this. For example, introspecting Lua tables is awkward when you're trying to
debug them by printing. I've been experimenting with Doom Emacs recently, and
I've found it to be far ahead on both discoverability and introspection, while
making tradeoffs in other places.

Whoa, did this just turn into an article about Emacs?

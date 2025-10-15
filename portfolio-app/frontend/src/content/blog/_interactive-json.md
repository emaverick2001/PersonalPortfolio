- keep coming across this situation: working with some large, undocumented JSON
object.
- need to understand the structure of the object to be able to do something with
it
- what's the best way to do so?

python script
- I used to do this. it works okay, but isn't as interactive as I'd like

jq
- jq is great. I love it. however, while it's good for querying known structures
in the file, it's not as good for exploring the JSON to determine those
structures in the first place.
- mapping to `keys` is okay, but this is kinda annoying because the query is in
the middle of the command

fq
- fq is similar to jq, with a focus on querying binary formats. most jq commands
work with it though, and it supports JSON
- BUT it also has an interactive mode, `-i`. this interactive mode has tab
completion 

mention: jq.nvim
- the jq experience but using the editor
- don't really want another plugin for this

mention
- dadbod + dbui
- already using it and it works great for jq; interactively add commands
- kind of has autocomplete with cmp but not as nice as fq

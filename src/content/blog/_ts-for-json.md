---
title: Why TypeScript is great for JSON processing
author: Debashis Biswas
tagline: You can't escape JavaScript (this time, because of JSON).
publishDate: 2023-09-26
---

I recently had to write a data migration tool at work. This particular migration
involved reading JSON data from a database, converting the data into another
JSON format, and sending it off to an endpoint.

Being a quick, short-lived script, I completed the task in Python. If I had to
do it again, I'd use TypeScript.

TypeScript gets quite a bit of criticism for being used for too many things,
despite some of the weird quirks it has from keeping compatibility with
JavaScript. However, I think those quirks are particularly well-suited for tasks
involving JSON.

rest of the outline
- JSON has JS in the name
- because it's a JavaScript object
- If you've done a lot of JSON parsing in another language, you'll know about
this quirk: values can either be null or not in the object (undefined)
- show javascript example
- wrapping this in other languages gets weird, because you're trying to convert
  between a JavaScript object and whatever features your langauge happens to
have
- python example
- okay so you don't like javascript or python. rust example
- it goes on. golang, java. the point is that this happens when you try to map
JavaScript's quirks into other languages
- JS is the best language to deal with JSON for this reason

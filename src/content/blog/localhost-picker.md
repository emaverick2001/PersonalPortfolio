---
title: Building a localhost picker on Linux
publishDate: 2025-02-08
---

I love automating little pieces of my development workflow. Recently, I thought
I'd tackle automating one part of my workflow that's relatively small, but
happens frequently enough: opening ports on localhost in my browser.

The flow I wanted to automate is one you've probably done countless times: start
a server on localhost, switch to your browser, open a new tab, type in
`localhost:8000`, and hit enter.

I wanted it to look something more like this: start a server on localhost, hit a
single keystroke to bring up open ports on the system, fuzzy find the one I
want, and select it to open it in my browser.

Some tools have a faster approach to this workflow. For example, if you use
[Vite](https://vite.dev/) as a dev server in a JS project, you can type `o`
after starting the server to automatically open the port in your browser. This
is nice, but it's specific to the tool. I'll sometimes start an ad-hoc server in
a directory using `python -m http.server`. The `o` keybinding isn't available
there, but my custom solution should be able handle it.

At a high level, the idea is to enumerate all of the ports open on localhost,
and then put them into a fuzzy finder which is available desktop-wide with a
shortcut.

## Enumerating open ports on localhost

First, I need to enumerate all of the open ports on localhost. This is easy
enough with `ss`:

```bash
ss -tlnpH
```

`-t` for TCP sockets, `-l` for listening sockets, `-n` to ensure that I can see
the port numbers, and `-p` to see the process using each socket, which will
allow me to show the name of each process in my selector later. `-H` hides the
header in the output, making it easier to pipe and parse.

This gives me an output that looks like this:

```
LISTEN      0           4096               0.0.0.0:5432            0.0.0.0:*      users:(("rootlesskit",pid=2526,fd=16))
LISTEN      0           511              127.0.0.1:46501           0.0.0.0:*      users:(("prettierd",pid=64746,fd=21))
LISTEN      0           511              127.0.0.1:38987           0.0.0.0:*      users:(("prettierd",pid=7414,fd=21))
LISTEN      0           4096               0.0.0.0:50287           0.0.0.0:*      users:((".spotify-wrappe",pid=96884,fd=148))
LISTEN      0           4096             127.0.0.1:631             0.0.0.0:*
LISTEN      0           10                 0.0.0.0:57621           0.0.0.0:*      users:((".spotify-wrappe",pid=96884,fd=128))
LISTEN      0           4096             127.0.0.1:11434           0.0.0.0:*
LISTEN      0           4096               0.0.0.0:3306            0.0.0.0:*      users:(("rootlesskit",pid=2526,fd=14))
LISTEN      0           4096                  [::]:5432               [::]:*      users:(("rootlesskit",pid=2526,fd=20))
LISTEN      0           4096                 [::1]:631                [::]:*
LISTEN      0           4096                  [::]:3306               [::]:*      users:(("rootlesskit",pid=2526,fd=21))
LISTEN      0           511                      *:3000                  *:*      users:(("next-server (v1",pid=12048,fd=24))
```

I don't need all of this information, however. I'll just need the port number
and the name of the process running on that port. Filtering it down:

```bash
ss -tlnpH 2>/dev/null | while read -r line; do
    port=$(echo "$line" | awk '{ print $4 }' | sed 's/.*://')
    process=$(echo "$line" | grep -o '".*"' | tr -d '"')

    [ ! -z "$process" ] && echo -e "$port\t$process" || echo "$port"
done
```

This extracts the port number after the colon in column 4 of the output. It
tries to match the process name by matching the inside of the double quotes on
each line.

We're getting closer. This gives me the following output:

```
5432    rootlesskit
46501   prettierd
38987   prettierd
50287   .spotify-wrappe
631
57621   .spotify-wrappe
11434
3306    rootlesskit
5432    rootlesskit
631
3306    rootlesskit
3000    next-server (v1
```

I know what processes are running on my machine, but what's `rootlesskit`? That
doesn't seem familiar.

It's the processes running in Docker. I'll need to get the name of the process
from Docker by using the port number. First, a helper function:

```bash
# If there is nothing to find on this port, prints an empty string.
get_docker_info() {
    local port=$1
    docker ps --format "{{.Names}} ({{.Image}})" -f "publish=$port" 2>/dev/null
}
```

...and now I can modify the main part of my script, giving me

```bash
ss -tlnpH 2>/dev/null | while read -r line; do
    port=$(echo "$line" | awk '{print $4}' | sed 's/.*://')
    process=$(echo "$line" | grep -o '".*"' | tr -d '"')
    docker_info=$(get_docker_info "$port")

    if [ ! -z "$docker_info" ]; then
        echo -e "$port\t$docker_info [docker]"
    elif [ ! -z "$process" ]; then
        echo -e "$port\t($process)"
    else
        echo "$port"
    fi
done | sort -n | uniq
```

I've also piped the output to `sort -n` and `uniq`, sorting entries numerically
and removing duplicate entries.

This gives me

```
631
3000    (next-server (v1)
3306    saferhire-db-1 (mysql:8.0.35) [docker]
5432    spire-db-1 (postgres) [docker]
11434
38987   (prettierd)
46501   (prettierd)
50287   (.spotify-wrappe)
57621   (.spotify-wrappe)
```

which is perfect for my fuzzy finder! Including the port number means I can
search by port, but can also see the process name. I don't think I'll often
use the process name to search, but the option is available.

## Fuzzy finding

I usually use something like [rofi](https://github.com/davatorium/rofi) (or
[wofi](https://hg.sr.ht/~scoopta/wofi), now that I'm on Wayland) as my
general-purpose menu program on Linux, but recently I've just been building
terminal programs that I can pop up as needed.

This makes it extremely easy to implement a fuzzy finding picker over my list of
ports. After saving the above script in my path, I can pipe it into `fzf` to
give me a picker and open the selected port in my browser:

```bash
localports.sh | fzf --reverse | awk '{ print $1 }' | xargs -I{} xdg-open "http://localhost:{}"
```

Fuzzy find over the results with `fzf`, select out the port number using `awk`,
and open a browser to localhost on the selected port.

## Global desktop binding

This is great so far, but it's just a bash script. I want to be able to run it
anywhere. Luckily, this is easy in a configurable environment like Linux: let's
save the script to a file and make a keybinding. With two lines in my
[Hyprland](https://hyprland.org/) config, I have a binding on Super + D that
opens a terminal window with my program.

```
$portPickerClass = com.maestoso.portpicker
bind = $mainMod, D, exec, ghostty --class=$portPickerClass -e bash -c '$HOME/bin/portpicker.sh'
```

Why `portPickerClass`? So that I can add some custom rules for the window. This
window doesn't need to get tiled like a normal window, as it's a temporary
popup:

```
windowrulev2 = float,class:($portPickerClass)
windowrulev2 = size 60% 60%,class:($portPickerClass)
windowrulev2 = noanim,class:($portPickerClass)
windowrulev2 = dimaround,class:($portPickerClass)
```

This makes the window a floating window, makes it a certain percentage of my
screen size, disables animations (gotta go fast), and dims everything else
around it while it's open.

## Future improvements

My solution works for my simple use case, but there is much more it could do if
I wanted to polish it further:

- Hiding entries such as databases
  - Blacklisting certain port numbers or process names?
- Showing process names only available to the root user
- Putting the most recently opened port on the top
  - If you know what the most recently opened port is, you might not even need a
    picker: could just have a shortcut for opening that port directly
- Distinguishing between IPv4 and IPv6

## On end-user programming

In just 30 lines of code, my environment allowed me to go from "I have an idea
for a novel way to interact with my computer" to a complete solution. This is my
favorite part of Linux: the capability for [end-user
programming](https://www.inkandswitch.com/end-user-programming/).

The problem with most end-user programming, however, is that it usually requires
too much time for most people to dedicate to solving their problem in a novel
way. Sure, this was just 30 lines of code, but it required general knowledge of
my operating system, working knowledge of bash, prior knowledge of fzf, and a
good understanding of how my desktop environment was set up with Hyprland. To be
honest, I don't write bash often enough to remember specifics, and it was much
easier to finish this quickly by pairing with Claude.

With LLMs decreasing the amount of time it takes to produce code, I'm excited to
see what might be possible with end-user programming. In a era where code is
cheaper than ever for an individual to produce code, _especially_ for small,
one-off tasks, I'd want environments which are more configurable, rather than
less. Perhaps we'll have the opportunity to see [more stories like this
one](https://youtu.be/FtieBc3KptU)!

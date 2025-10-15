---
title: Customizing Spotify notifications on Linux
publishDate: 2025-02-11
---

I recently wanted to customize Spotify media notfications on Linux. Every time I
change songs, I get a desktop notification with the new song's information. I
wanted to this notification to stand out in comparision with other notfications
on my system: a notification from Spotify should be outlined in green. This was
a quick and fun project which utilized a lot of Linux knowledge that I've built
up over the years, and I thought I'd share the process.

Notifications on Linux work through D-Bus, a message bus that allows
applications to communicate with each other. Applications can publish messages
to the message bus, and other applications can read those messages. Protocols
ensure there is a standard structure and order for messages. For example, [here
is the protocol for
notifications](https://specifications.freedesktop.org/notification-spec/latest/index.html),
which I needed to reference for this project. 

Spotify sends messages to D-Bus, but which application reads them? That's where
notification daemons come in. [There are many available options for notfication
daemons](https://wiki.archlinux.org/title/Desktop_notifications) - i3 users
often use [dunst](https://dunst-project.org/).

I happen to use [mako](https://github.com/emersion/mako), but they're all
similar. Whenever a notification is published on D-Bus, `mako` reads it and
shows a small window with the notfication content. It provides a simple config
file for customizing this window (font, size, location, color, etc).

The path is clear: I need to configure `mako` to change the border color for
notifications published by Spotify.

## Reading the manual

First, I need to know how to configure `mako` based on information in the
notification.

`man mako` redirects me to the config file documentation on man page 5. With `man 5
mako`, I can see that I can configure notifications based a variety of fields.

```
•   app-name (string)
•   app-icon (string)
•   summary (string): exact match on the summary of the notification. This field conflicts with summary~.
•   summary~ (string): a POSIX extended regular expression match on the summary of the notification. This field conflicts with summary.
•   body (string): an exact match on the body of the notification. This field conflicts with body~.
•   body~ (string): a POSIX extended regular expression match on the body of the notification. This field conflicts with body.
•   urgency (one of "low", "normal", "critical")
•   category (string)
•   desktop-entry (string)
•   actionable (boolean)
•   expiring (boolean)
•   mode (string): only apply style options in this section if the provided mode is currently enabled. For more information about modes, see the MODES section.
```

Based their provided example and the options provided in the rest of the file, I
should be able to do this:

```
[app-name="Google Chrome"]
border-color=#ffbf00
background-color=#000000
```

This would change the border and background color notifications coming in from
Google Chrome. There's a lot of flexibility here. For notifications coming from
Spotify, I could even match an artist name or song title with a regex for more
fine-grained configuration. My favorite artist could be shown in another color,
for example.

To do any of this, I'll need to figure out what information Spotify is pubishing
on the message bus. In this case, I want to match the app name. It looks like
the string needs to be exact match, so rather than guessing, I want to confirm
exactly what name Spotify is using when publishing notifications.

## Eavesdropping on inter-process messages

I can monitor D-Bus messages using `dbus-monitor`. This should allow me to
directly inspect the message and see what data Spotify is publishing to the
bus, and what `mako` should be picking up. 

`dbus-monitor` is a bit too chatty to read easily, however. I'll need to narrow
down the messages to just the ones I care about. After reading the output to
figure out how it's broken down and playing with some filters, I ended up with
the following command:

```bash
dbus-monitor "interface='org.freedesktop.Notifications'" | grep "member=Notify" -A 10
```

This narrows down the output to "Notify" messages as specified by [this
documentation](https://specifications.freedesktop.org/notification-spec/latest/protocol.html#command-notify).

When changing a song in Spotify, I can see the message:

```
method call time=1739299183.583906 sender=:1.1008 -> destination=:1.1242 serial=1015 path=/org/freedesktop/Notifications; interface=org.freedesktop.Notifications; member=Notify
   string "Spotify"
   uint32 62
   string ""
   string "Chasing the Torrents"
   string "Yu-Peng Chen - Genshin Impact - Jade Moon Upon a Sea of Clouds (Original Game Soundtrack)"
   array [
   ]
   array [
      dict entry(
         string "icon_data"
```

Based on this output, it seems like the first field is the app name ("Spotify"),
the fourth is the song title, and the fifth is the album title. Matching up the
fields with the above documentation, we get

| Field | Description | Value |
| ------------- | -------------- | -------------- | 
| `app_name` | name of application sending notification | Spotify |
| `replaces_id` | notification id to replace | 62 |
| `app_icon` | icon of app making call | - |
| `summary` | summary text (song title) | Chasing the Torrents |
| `body` | detailed body text (artist and album title) | Yu-Peng Chen - Genshin Impact - Jade Moon Upon a Sea of Clouds (Original Game Soundtrack) |

For the curious, it's this track:

<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/7kdCsTElryhtspvrUVXfBS?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>


Fantastic - I've confirmed that "Spotify" is the correct app name, and have more
information on where to find the artist, song, and album data in the future.

## Putting it together

Using this information, I can finish configuring `mako`. I've matched Spotify's
branding colors using https://usbrandcolors.com/spotify-colors/.

```
[app-name=Spotify]
border-color=#1DB954
background-color=#191414
```

Success! The end result that only Spotify notifications have a green border. In
the image, this is shown next to a regular notification, generated with
`notify-send "Test" "This is a test notification"`.

![demo](./notifications.png)

## Why?

Seems like a lot of work for a green border. Was it worth it?

I would say so. I enjoy feeling like I have full control over my computer -
feeling like I can get it to do anything I want it to. Every time I learn more
about how Linux works, it composes well with my existing knowledge. New avenues
open up.

For example, with the information I have now, it'd be trivial to write a script
that health checks one of my production environments, runs periodically with
`cron`, and pops up an attention-grabbing red notification if anything is
abnormal. Not bad!

---

I have other information in my `mako` config as well. If you'd like to replicate
the same look, this is my full config.

```
font=IBM Plex Sans 12
width=300
height=100
margin=12
padding=12
border-size=2
border-radius=8
text-alignment=left

layer=overlay
anchor=top-right

markup=1
actions=1
history=1
icons=1
max-icon-size=48
icon-location=left

ignore-timeout=0
default-timeout=10000
max-history=100
max-visible=5
sort=-time

on-button-left=dismiss
on-button-middle=none
on-button-right=dismiss-all
on-touch=dismiss

background-color=#191414
text-color=#d9e0ee
border-color=#313244
progress-color=over #89b4fa

[urgency=low]
border-color=#313244
default-timeout=2000

[urgency=normal]
border-color=#313244
default-timeout=5000

[urgency=high]
border-color=#f38ba8
text-color=#f38ba8
default-timeout=0

[app-name=Spotify]
# https://usbrandcolors.com/spotify-colors/
border-color=#1DB954
background-color=#191414
```

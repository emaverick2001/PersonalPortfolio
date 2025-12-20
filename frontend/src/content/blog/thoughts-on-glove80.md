---
title: Thoughts on the Glove80
publishDate: 2024-10-05
description: >-
  Reviewing the most well-designed split ergonomic countoured columnar-staggered
  (am I too far into ergo keyboards?) keyboard
---

These are my impressions of the [MoErgo
Glove80](https://www.moergo.com/collections/glove80-keyboards/products/glove80-ergonomic-keyboard-revision-2-with-cherry-blossom-30gf-silent-linear-switches?variant=50146620965137)
after using the [Kinesis Advantage360
Pro](https://kinesis-ergo.com/shop/adv360pro/) for about a year and a half.

The Advantage360 Pro is a great keyboard, and I'm grateful to Kinesis for making
a product that may have saved my career early on. However, the 360 Pro has some
design flaws which are a bit unexpected from a keyboard with a nearly $500 price
tag.

I find that the Glove80 solves *every single one of these flaws* with surgical
precision. It's also less expensive!

In short, I believe the Glove80 succeeds in a few primary design decisions:

- Creating the most ergonomic keyboard possible.
- Incredible attention to detail, providing an answer to all of the "papercuts"
in the design of the existing split ergonomic keyboards on the market.
- Providing an experience that is worthy of the keyboard's price tag.

Seriously, I am loving this keyboard.

I ended up ordering the Glove80 after getting frustrated with the bluetooth
issues on the 360 Pro. A well-known issue with the 360 Pro is that the two
halves will sometimes have trouble connecting. One morning, before work, it took
me 10 minutes to connect the two halves. I remembered watching the Glove80
reviews from [Ben Frain](https://youtu.be/Q-mNGb7-Ywo), [If Coding Were
Natural](https://youtu.be/iwjtiNxAkMA), and [Code to the
Moon](https://youtu.be/PFFa3h7eLWM) - there was a way out! I went straight the
MoErgo website and bought the Glove80.

Here are my impressions, which are primarly comparisons with the 360 Pro.

## First impressions

First off - the bluetooth works flawlessly. Pull the keyboard out of the **travel
case**, turn the two halves on, and start working. I feel like I shouldn't even
have to mention this, as it should be a given. However, this was not the case
with the 360 Pro.

Also, yes, it comes with a travel case. This is nice because I take the keyboard
to and from work. Kinesis does not have a travel case for the Advantage360 Pro,
but I was able to make one using [this case from
Amazon](https://www.amazon.com/gp/product/B09WBWTL8B/). It's great that MoErgo
includes an official one.

## Ergonomics

The Glove80 is incredibly comfortable to type on, which is important for an
ergonomic keyboard! I find that the Glove80's design around ergonomics makes
much more sense to me than the 360's design.

First of all, the Glove80 is low profile - it doesn't sit very high on the desk.
The 360 is quite thick, and I never understood how I was meant to work around
this aspect of the design. Even when working at adjustable-height desks, I could
never get my desk low enough so that the 360 would be at a comfortable height.
When I did, my desk would be too low while I was using my mouse. The Glove80's
low profile solves this. Funny enough, this problem is actually directly
referenced in some of MoErgo's marketing material. This is what I mean when I
say the Glove80 brings an attention to detail to many of the papercuts in design
that I've seen in competing keyboards.

The Glove80's thumb cluster is also much more usable than that of the 360. Out
of the 6 keys allocated to the each thumb on the 360, I only found 2, maybe 3,
usable by my thumbs while typing. The other keys are so far out of the way that
I was never able to figure out their intended use. Are you meant to reach for
them? Are they just extra keys tacked onto the thumb cluster? When I did use
them, primarily as modifier keys, I'd have to contort my wrist at a weird angle
to combo them with other keys. To be fair, I also had this problem on the
Ergodox, on which I ended up flipping around a keycap on the bottom row for use
as a third usable thumb key. The Glove80's 6 thumb keys are all located in a place that
is comfortable to reach from the thumb. Honestly, it's one of the few thumb
clusters I've seen that actually looks like it's designed for a human thumb.

While most ergonomic keyboards use MX-style mechanical switches, the Glove80
uses choc switches, which are a low-profile mechanical switch. I wasn't sure how
I'd find this, but as soon as I used them, I was immediately on board. My
Glove80 has the new Cherry Blossom switches, and it's the smoothest typing
experience I've ever felt. They're extremely quiet, and while my younger self
might have preferred the feedback of a heavy, loud switch (I used to type on
ergo clears), I've come to appreciate light and silent switches. Lighter
switches are much less fatiguing, and the quieter sound profile makes me feel
more nimble on my fingers. This is the same feeling I got from using the
Logitech MX Keys for a while. Maybe it's my musical training - the low-profile
silent switches almost feel like playing an instrument to me. I can train my
fingers to move as efficiently as possible, moving no more than absolutely
essential to hit each key.

## Customizing the keyboard

I also find the Glove80's solution to customizing the keyboard much better than
the 360. The 360's workflow is as follows:

- Fork the keyboard's ZMK configuration repo from Kinesis on GitHub
- Make changes in code, commit and push them up
- Wait for the GitHub Actions workflow to build your new firmware (takes about 2
  minutes on average), or build locally with the provided Docker setup
- Flash the firmware onto the keyboard

The amount of technical knowledge required for this process isn't great for most
people, but I wasn't too bothered by it. I get that Kinesis recommends only
recommends this options for powerusers. However, I was bothered by waiting for
2 - 3 minutes for a build every time I made a change to my layout. I also wasn't
a fan of waiting 2 minutes just to see a build error from a typo or syntax error
in my config.

I also didn't find a lot of support or information from Kinesis on
details around programming the keyboard. I was usually able to find what I
needed from the ZMK docs, but not always. For example, some options in ZMK
require the keyboard's key positions, which I couldn't find any information for
([I ended up contributing this back to the repo after I figured it
out](https://github.com/KinesisCorporation/Adv360-Pro-ZMK/issues/217)). In
general, the experience around the software with the 360 Pro still feels
unfinished, especially given the price point - for a product like this, it's not
enough to just get the hardware right.

The Glove80 is much better this regard, and provides an online layout editor.
Here's the workflow:

- Make a layout on the online editor
- Build the firmware (takes about 5 seconds for me!)
- Flash the firmware onto the keyboard

While it's not as nice as Oryx from ZSA, it's pretty good for most quick
changes, and most importantly, firmware builds quickly! [There is also good
documentation provided](https://docs.moergo.com/layout-editor-guide/). Custom
ZMK-level changes are also quite straightforward. I was able to move my homerow
mod setup from my 360 config over within minutes.

## Downsides?

When I was initially writing this, I was going to list the tenting mechanism as
one of the pitfalls of the Glove80. The tenting mechanism is achieved with feet
that can be unscrewed to adjust the height. This allows for a precise level of
customization, but the mechanism can be tedious to screw and unscrew, especially
when using the travel case often. A few points on this:

- This design choice is intentional. As I mentioned before, the Glove80 is
designed to be as ergonomic as possible, and offering this level of custom
tenting serves that goal even if it is at the cost of being a bit more
inconvenient.
- I assumed I would need to screw the feet back in every time in put the
keyboard back in the travel case. It turns out this is not necessary - the case
is able to hold the keyboard comfortably even with my current tenting
configuration!

Because of this, I'm not even sure that I have any strong downsides of the
Glove80 to mention.

Thanks to MoErgo for a making great keyboard!

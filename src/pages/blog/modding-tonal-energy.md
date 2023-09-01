---
title: Modding Tonal Energy's Android App
---

# Modding Tonal Energy's Android App

In this project, I modify [Tonal Energy](https://www.tonalenergy.com/),
specifically the [Android
app](https://play.google.com/store/apps/details?id=com.sonosaurus.tonalenergytuner).
The application includes many great tools for musicians, and I specifically
focus on the metronome, which I use while practicing music.

## Background

While using the metronome, users can adjust tempo in small increments, using +/-
buttons, or large increments, using the wheel and slider features. During
practice, I often find myself wanting to increasing the tempo by a small
standard increment, such as 6 BPM (for example, to change the tempo from 126 BPM
to 132 BPM). With the existing options, I can either press the plus button 6
times, or try to carefully adjust the wheel/slider, which are quite sensitive
and designed for larger adjustments, to try to adjust by the exact number I
need.

For this project, I decided to modify the +/- buttons to instead use standard
tempo increments, which can be found on [this
page](https://issuu.com/robertpaterson/docs/standard-metronome-timings-and-rati).
These are tempo markings commonly used among musicians, and the increments take
advantage of the idea that perception of tempo is not a linear scale; for
example, a difference in 2 BPM is more perceptible between 42 and 44 BPM than
between 120 and 122 BPM.

## Included files

For context, these are the files included with the project. Further context
on relevant files is explained in the rest of the writeup.

- `frida-agent/`
  - Node project - Frida agent in TypeScript
- `gadget/`
  - Frida Gadget binaries
- `modded-build/`
  - Folder for storing modified APK after rebuilding + aligning + signing
- `tetuner-unpack/`
  - Unpacked version of app. Modifications are made here
- `base.apk`
  - Tonal Energy's original Android APK, retrieved with `adb`
- `com.maestoso`
  - Key for self-signing APK
- `asdf.sh`
  - Builds and installs app
- `build.sh`
  - Turns `tetuner-unpack/` into installable APK, places in `modded-build/`
- `deploy.sh`
  - Installs app on connected device through `adb`
- `get-apk.sh`
  - Gets Tonal Energy APK from connected device through `adb`
- `inject-gadget.py`
  - Injects Gadget as a dependency of `libjuce_jni.so`
- `frida-gadget-config.json`
  - Gadget config file, copied into `tetuner-unpack/` before building

## Analyzing the application

### Acquiring the APK

To begin analyzing the application, I first needed to acquire application's APK,
which is format in which apps are packaged on Android. The app is not free, but
because I own it already, I was able to pull the APK from my phone using adb. In
the included files, the command I used to do this is included in `get-apk.sh`.
This APK is included in the files as `base.apk`.

Once I had the APK, I needed to analyze it. Fortunately, because Android apps
are written in Java and Kotlin, they are compiled to bytecode, making it easy
to decompile, understand, and modify the code. Additionally, the contents of
an APK can be unzipped to see all of the contents. Instead of needing to analyze
the Dalvik bytecode, I was able to use [jadx](https://github.com/skylot/jadx)
to read the decompiled Java to get an idea of how the application worked.

Also, while it is possible to unzip the APK and analyze the contents, rebuilding
the APK correctly can be tedious. I found it to be much easier to use
[apktool](https://ibotpeaches.github.io/Apktool/) for both unpacking and
rebuilding the app. The included `tetuner-unpack` directory is the unpacked
version of the app, and `dist/base.apk` in this directory is the repacked
version of the application, with my modifications. However, this APK can
not be installed directly; I had to ensure bytes were properly aligned and
the APK was signed before being allowed to install it in the device. The script
I wrote to do this is included as `build.sh`, and `deploy.sh` is a quick
script which deploys the app. `asdf.sh` does both, and is easier to type.
This script was used to in between changes to redeploy my changes to my phone.

### Analyzing native code

Looking at the decompiled code in jadx, I was only able to see a few Java
files, which I thought was weird considering the scope of the app. Turns out,
the Android application (and I would assume, the iOS application) is a thin
wrapper around the real application: a C++ application written using the
[JUCE](https://juce.com/) framework. This was probably done for ease of
development: by using JUCE, the developers could maintain a single codebase for
both platforms. JUCE is specifically useful for writing audio applications,
which makes it a good selection for writing an app for musicians.

This means that my modification could not be done in the Java code; I had to go
further and analyze the compiled `.so` library that was loaded at runtime. This
is loaded using Java's JNI, through Android's NDK: in short, tools that enable
Android developers to use native C++ functions in their apps.

Looking at the rest of the files in the unpacked APK, I found a
`tetuner-unpack/lib` directory which included native libraries. This folder
included folders for each architecture, each of which included the same few
libraries. The file I was interested in was called `libjuce_jni.so`, a 23 MB
library which was the rest of the app's implementation I was looking for. I
decided to analyze the 64-bit ARM version, as I am using a Pixel 4a.

I spent a while in [Ghidra](https://ghidra-sre.org/) analyzing this binary to
understand where the +/- button clicks are handled. Luckily, "`buttonClicked`"
is a common name for this handler, and I was quickly able to find the
`MetronomePage::buttonClicked` handler, which, after a few function calls, gets
to `Metronome::setTempo`. Finding the correct call of `setTempo` took some time,
as the event handler was large and it took me a while to understand the flow of
the function.

`setTempo` takes two parameters: a `Metronome*` and a `double`. I determined
that this was how Ghidra decompiled a one-parameter function in the `Metronome`
class - the first parameter is just a pointer to the current instance. The
double that gets passed in is first checked to ensure it is not negative or
infinity, and then gets assigned to a variable at some offset of the
`Metronome*`, which I assumed is where the current tempo is stored. The second
parameter, then, is new value for the tempo. Basically, the function signature
looks like this:

```cpp
void setTempo(Metronome* this, double newTempo)
```

## Modifying the application

### Updating the value

In `buttonClicked`, the value of the current tempo is copied into a local
variable, incremented/decremented by one (depending on if the + or - button was
clicked), and passed into the `setTempo` function. Rather than changing the
value by one, I could instead change by 4, which would only require me to change
the 8-byte double in the binary without changing the size of the binary.

This worked, but was not the full feature I wanted to implement. I wanted to
change the value to the next expected value in the standard tempo markings
mentioned above, which are not evenly spaced. This type of change required
more than changing bytes in place.

### Implementing the rest of the feature

Around this time in the project, I talked to Fish about adding more substantial
changes to binaries. He recommended [Frida](https://frida.re/) and
[LIEF](https://lief-project.github.io/), both of which I ended up using on this
project. I decided to use Frida for adding my feature, but I may have been
able to add my feature into the binary using LIEF as well.

#### Setting up Frida

The easiest way to use Frida is to use it in "injected" mode, in which we can
run `frida-server` on the device and use it to hook into any running process by
connecting through a client on the desktop. However, this requires the Android
device to be rooted. This would also mean that the feature would not be embedded
in the app itself. Because my device is not rooted, and I wanted my patch to be
embedded directly into the APK rather than depending on the external
environment, I did not choose this option.

Luckily, Frida also has an embedded mode called Gadget, which was perfect for
my use case. Rather than running `frida-server` on the device, this option
allowed me to add `frida-gadget` as a dependency of `libjuce_jni.so`, causing
the application to expose Frida's server when the library is loaded. This does
not require the device to be rooted, and is included in the app itself. For an
Android application, this method works best if these is a native library loaded
early in the function - and because the whole application depends on
`libjuce_jni.so` being loaded at startup, this method worked well.

To use Gadget, I had to include the binary, which I downloaded from their
[GitHub releases](https://github.com/frida/frida/releases). To get Android to
include Gadget in the installed APK, I put it in the `tetuner-unpack/lib` folder
next to the other libraries, and named it `libfrida-gadget.so`. This was
necessary because Android will only copy files from the `lib` directory which
begin with `lib` and end with `.so`. For reference, the Gadget binaries I used
are located in the included files in the `gadget` directory.

To load Gadget on startup, I needed to add my new `libfrida-gadget.so` as a
dependency of the main `libjuce_jni.so`. This was quite easy with LIEF, and the
script I wrote to do this is in the included files, called `inject-gadget.py`.

#### Hooking the setTempo function

With Gadget added to the binary, I could connect to Frida's server running on
the device. To hook the function I wanted to modify, I could quickly write a
hook using the provided [TypeScript
example](https://github.com/oleavr/frida-agent-example) and run it through
Frida's command line tools to connect to the server. Because I had already
statically analyzed the binary, I knew which function to hook, what it was
called, and what logic to replace. My hook is in `frida-agent/agent/index.ts`, a
TypeScript file which builds down to `frida-agent/_agent.js`. With this hook, I
replaced the function to use the standard tempo increments, adding the feature I
was aiming for.

#### Making the whole modification self-contained within the APK

At this point, Frida's server was automatically being run on the device when the
app started up, but I still had to run the client manually, meaning the feature
was not fully embedded in the APK. Continuing to read through Frida's
documentation, I learned that a config file could be added, which I added in the
same `tetuner-unpack/lib` folder as `libfrida-gadget.config.so`. Though this
file is a JSON file, this naming convention was used so that Android would copy
it when installing the app. The similarly with the `libfrida-gadget.so` name
was also necessary so that Gadget could identify this as the config file.

This config file allows an option to load a script on startup from a given path
on the device, rather than waiting for a client to connect, which was what I
needed. Rather than connecting to the running server from my desktop, I could
load the hook itself from the device. This required the built
`frida-agent/_agent.js` to to reside on the device, which I copied over using
`adb`. With this change, the entire modification was finally on the device, but
not all embedded into the APK itself.

The Frida docs also mention that the path to the hooking script in the Gadget
config file can be a path relative to where the Gadget binary resides. I realized
that, as with the other files, I could put my `frida-agent/_agent.js` script in
the APK's `lib` folder, and it would be included as long as it begins with
`lib` and ends with `.so`. I put my agent script in the APK's `lib` folder as
`libfrida-agent.so`, and pointed the path in the Gadget config file to
`./libfrida-agent.so` - this would be the relative from the Gadget binary,
as they would now be in the same folder.

## Result

It worked! On startup, the Java section of the application loads
`libjuce_jni.so`, which calls `libfrida-gadget.so` as a dependency. This uses
the JSON stored at `libfrida-config.so` as a config file, configuring Frida to
automatically load the JavaScript script stored at `libfrida-agent.so`. This
script hooks the `setTempo` function in `libjuce_jni.so`, replacing it with my
implementation which changes the behavior to increment and decrement the tempo
by standard tempo values rather than by one. This is all included in the APK
itself, so to install this modified version of the application, one would only
need to install the APK and nothing else. No root required either.

I am happy with the result. The unique architecture of this application meant
that I could not find many resources on what I was trying to do, so I had to
piece together most of this on my own using skills I learned in this course
throughout the semester. I am planning on publishing a blog post on my process
on this project, which will hopefully be helpful for future Android reversers
who find themselves needing to modify an app that heavily depends on a C++ UI
framework.

If my patch had users and I had to do this more optimally, I would attempt to
use LIEF instead of Frida to hook the function I replaced. While I had a great
experience with Frida, and Frida's decision to expose their API through
scripting languages such as JS and Python helped me move quickly, Frida might
not be the best option for tiny changes like this one. The 32-bit Gadget binary
is about 15 MB, and the 64-bit binary is about 23 MB. This is quite a big
addition, especially considering that I only modified a few lines of code.
Building Frida from sources does provide the option to exclude unused parts of
the Gadget binary, but LIEF allows direct changes to the target binary itself.
Because this whole app is essentially implemented as a C++ application, and my
change is quite small, LIEF may allow me to make small modifications like this
without inflating the bundle size.

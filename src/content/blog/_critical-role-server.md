---
title: Self-hosting for the optimal Critical Role experience
publishDate: 2025-05-19
---

For this project, I self-host a media server with
[Jellyfin](https://jellyfin.org) set up [Tailscale](http://tailscale.com) to
securely access my server from anywhere, and write a script to allow me to
quickly download Critical Role episodes to the media server.

## Background

A few years ago, I watched the [first season of Critical
Role](https://youtube.com/playlist?list=PL7atuZxmT954bCkC062rKwXTvJtcqFB8i). If
you haven't heard of it, it's a great show! It's a bunch of well-known voice
actors playing Dungeons and Dragons. They're all great at voices, accents,
impressions, storytelling, and improv, and it makes for an exciting show.

The show is long. It was livestreamed weekly on Thursdays starting in 2015. Each
episode is anywhere between 2 to 4 hours long, and the first season has about
115 episodes! It took me a while to get through it. I got through most of it
while walking across campus between classes during my master's degree.

I decided to watch the second season recently, but I wanted a better way to sync
my progress between devices, as I'll often listen to the show while driving or
in the background on desktop. YouTube works, but doesn't always sync progress
properly, and I didn't enjoy scrubbing through 4-hour long videos when progress
didn't sync. There is a Spotify podcast, but it's missing some content, doesn't
have the video, and I found it frustrating to scroll through the app to find the
show again whenever I wanted to continue listening.

The goal: Critical Role Season 2, properly synced between devices. Continue
watching/listening with as close to one click as possible. 

## The plan

At a high level, this is how I approached this project:

- Set up a server
- Install Tailscale for secure access
- Install Jellyfin for the media server
- Write a script to easily download show episodes into Jellyfin

## Acquiring a server

For the server, I decided to rent a VPS. I could have used an old computer, but
I've already done so on past projects and didn't want to do that here.

I'd normally use something like Linode or DigitalOcean for this, but media
servers need storage, and storage is expensive on these platforms. However, I
recently saw a [video from Dax Raad where he explains his remote development
setup](https://youtu.be/KQ2gz5i7VAA). In the video, he recommended looking for
VPS providers with desktop CPUs, rather than server CPUs. Following this advice,
ended up finding [Oplink](https://oplink.net), and found a server with a Ryzen
9950x (one vCPU), 4 GB memory, 100 GB of NVMe storage, and 10 TB of data
transfer - all for $7.95 a month.

==TODO: make a better point about how having a server enables many other
projects==

You might argue that this is a bit expensive for one hobby project, and maybe
overkill for a media server, and you might be right! However, I can also use
this server for other things. Unrelated to this project, I've also set up
[Syncthing](https://syncthing.net/) to sync files across all of my devices. I've
also been curious about [Kamal](https://kamal-deploy.org/) from 37signals.
Having a server that I manage allows me to build low-scale projects just for
myself in the spirit of [this post](https://thesephist.com/posts/tools/). I find
this empowering.

## Initial setup

The server came with Alma Linux. This is fine, though in the future it'd be nice
to run NixOS.

The first thing I did to set up the server was install Tailscale. Tailscale is
_awesome_ - you can easily connect all of your devices as though they're on the
same network, even mobile devices. After installing
[Tailscale](https://tailscale.com), I used `ufw` to block public network access,
so that the server would only allow connections from inside the Tailscale
network.

I also installed Docker and Nix. Docker for the Jellyfin server, and Nix for my
download script (more on this later).
  
## Setting up Jellyfin

Jellyfin was trivial to set up with Docker Compose. I created a
`docker-compose.yml` with the following content, and started the service with
`docker compose up -d`.

Importantly, `/media:/media` creates a bind mount, binding the `/media`
directory on the host to the `/media` directory in the container. When I
download episodes, I can put them on `/media` on the host for the Jellyfin
server to serve them.

```yml
services:
  jellyfin:
    image: jellyfin/jellyfin
    container_name: jellyfin
    network_mode: 'host'
    volumes:
      - /root/jellyfin/config:/config
      - /root/jellyfin/cache:/cache
      - /media:/media
    restart: 'unless-stopped'
```

Jellyfin's default port is `8096`, and after starting the container, I could see
access my media server from a browser from any of machines in Tailscale:

==TODO: screenshot==

## Downloading episodes

- write script for downloads
- shell.nix for dependencies! it's a nice balance for this lightweight script
- yt-dlp to get episodes
  - includes sponsorblock information, allowing me to skip the intro sequence
    and the break in the middle
- gum as the picker "frontend"
- the youtube playlist has some videos in the middle of the playlist
  (characters rolling levels which I wanted to see in order, but I still
  needed to keep the episode numbers correct. I do some work using an NFO
  file (link) and treat those episodes as "specials" for jellyfin so that they
  show up in the right order without messing up episode numbering)
- to be honest I probably should have used something other than bash for this.
  not parallelized or anything, but I don't use it often enough that it's
  worth taking further
- I use this script by sshing into the machine whenever I'm going to finish
  the episodes I've downloaded: I pre-download like 10 episodes, which lasts a while

==TODO: gif==

```nix
{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  packages = [
    pkgs.python3Packages.yt-dlp
    pkgs.jq
    pkgs.gum
  ];
}
```
  
  ```bash
#!/usr/bin/env bash

set -euo pipefail

PLAYLIST_URL="https://www.youtube.com/playlist?list=PL1tiwbzkOjQxD0jjAE7PsWoaCrs0EkBH2"
SHOW_NAME="Critical Role"
SEASON_NUM="02"
BASE_DIR="$(pwd)"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -d|--dir)
      BASE_DIR="$2"
      shift 2
      ;;
    *)
      echo "Usage: $0 [-d|--dir <download-directory>]"
      exit 1
      ;;
  esac
done

SHOW_DIR="$BASE_DIR/$SHOW_NAME"
SEASON_DIR="$SHOW_DIR/Season $SEASON_NUM"
SPECIALS_DIR="$SHOW_DIR/Season 00"

playlist_data=$(gum spin --spinner "line" --title "Getting videos..." -- \
  yt-dlp -j --flat-playlist "$PLAYLIST_URL")

mapfile -t playlist_entries < <(
  echo "$playlist_data" |
  jq -r '[.id, .title] | @tsv' |
  nl -w3 -s$'\t'
)

declare -A playlist_index_to_episode
for entry in "${playlist_entries[@]}"; do
  index=$(echo "$entry" | cut -f1)
  title=$(echo "$entry" | cut -f3-)
  ep=$(echo "$title" | grep -oP 'Episode \K\d+' || true)
  if [[ -n "$ep" ]]; then
    playlist_index_to_episode["$index"]=$ep
  fi
done

selected=$(gum choose --no-limit "${playlist_entries[@]}" --header "Download episodes (to $BASE_DIR)")

if [[ -z "$selected" ]]; then
  echo "No episodes selected."
  exit 0
fi

echo "Downloading selected episodes..."
mkdir -p "$SEASON_DIR" "$SPECIALS_DIR"

while IFS=$'\t' read -r index video_id title; do
  episode_num=$(echo "$title" | grep -oP 'Episode \K\d+' || true)

  if [[ -n "$episode_num" ]]; then
    filename="$SEASON_DIR/$SHOW_NAME S${SEASON_NUM}E$(printf "%02d" "$episode_num").%(ext)s"
  else
    safe_title=$(echo "$title" | tr '/:*?"<>|' _)
    filename="$SPECIALS_DIR/$safe_title.%(ext)s"

    airs_before=""
    for ((i=index + 1; i <= ${#playlist_entries[@]}; i++)); do
      if [[ -n "${playlist_index_to_episode[$i]:-}" ]]; then
        airs_before="${playlist_index_to_episode[$i]}"
        break
      fi
    done
    airs_before="${airs_before:-999}"

    nfo_path="${filename%.*}.nfo"
    cat > "$nfo_path" <<EOF
<episodedetails>
  <title>${title}</title>
  <plot>Auto-downloaded from Critical Role Season 2 playlist</plot>
  <airsbeforeseason>${SEASON_NUM}</airsbeforeseason>
  <airsbeforeepisode>${airs_before}</airsbeforeepisode>
</episodedetails>
EOF
  fi

  yt-dlp \
    --sponsorblock-mark all \
    --add-metadata \
    --merge-output-format mp4 \
    -o "$filename" \
    "https://www.youtube.com/watch?v=$video_id"
done <<< "$selected"
  ```

- set up clients on iOS
  - Tailscale app
  - [SenPlayer](https://apps.apple.com/us/app/senplayer-hdr-media-player/id6443975850)
    - good jellyfin client, has a setting to continue playing in the background!

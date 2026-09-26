import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const tracks = [
  ["Dreams", "https://on.soundcloud.com/t40q3b7B5CduyqqRuc"],
  ["Sirens", "https://soundcloud.com/prod_by_mv/sirens?si=e6964bf00ddd4d7bb4322859ca1c3091&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"],
  ["Remnant", "https://soundcloud.com/prod_by_mv/remnant-160-tenji-x-nightiger-160-a?si=632efae050f340c7ba92299bfb063676&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"],
  ["Trace", "https://i.pinimg.com/736x/97/79/fa/9779fad3ff892b9c466beea75fa6fa3b.jpg"],
  ["Shattered", "https://soundcloud.com/prod_by_mv/shattermind170-jayysoul-x-tenji-cmaj?si=ea4672dd097a4b18bdb81c18f8399217&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"],
  ["Reminisce", "https://soundcloud.com/prod_by_mv/violet-x-meta-type-beat?si=1e5af4c7d51e491189ccc76fce9c5063&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"],
  ["808 fun", "https://soundcloud.com/prod_by_mv/spookycreepyloopsnippet?si=09316d03ccb24645a791e84c1107ec42&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"],
  ["Hardstyle", "https://soundcloud.com/prod_by_mv/kirai-type-beat?si=ae7a4778494640cb809b7b9f10ee9e97&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"],
  ["Glide", "https://soundcloud.com/prod_by_mv/savestate-ddertbag-ripsquad-type-beat?si=b1482b0f03a6420c8e0e2c03dc35c8e5&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"],
  ["Discovery", "https://soundcloud.com/prod_by_mv/hyperpop-type-beat?si=2d79d9595afc47959780100c43011dfb&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"],
  ["Explore", "https://soundcloud.com/prod_by_mv/ivyleague-type-beat?si=2f3fb93b50f347cf90740972f4929aec&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"],
  ["LostInSpace", "https://soundcloud.com/prod_by_mv/lostinspace?si=2587c69ba1844d6ba273bf5598b994b3&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"],
]

const html = await readFile("dist/music/index.html", "utf8")
const cardBlocks = html.match(/<a\b[^>]*data-music-card[^>]*>[\s\S]*?<\/a>/g) ?? []

test("Music uses the approved shared shell", () => {
  assert.match(html, /class="site-header"/)
  assert.match(html, /href="\/music\/"[^>]*aria-current="page"/)
  assert.match(html, /class="[^"]*music-page/)
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1)
})

test("Music preserves every track and destination in the approved order", () => {
  assert.equal(cardBlocks.length, tracks.length)
  for (const [index, [name, href]] of tracks.entries()) {
    const card = cardBlocks[index]
    assert.ok(card.includes(name), `${name} should remain in position ${index + 1}`)
    assert.ok(card.replaceAll("&amp;", "&").includes(`href="${href}"`), `${name} should keep its destination`)
  }
})

test("Track artwork and outbound listening remain accessible and opt-in", () => {
  assert.ok(cardBlocks[0], "the track archive should render at least one card")
  assert.match(cardBlocks[0], /data-featured/)
  for (const [index, [name]] of tracks.entries()) {
    const card = cardBlocks[index]
    assert.match(card, /target="_blank"/)
    assert.match(card, /rel="noopener noreferrer"/)
    assert.ok(card.includes(`alt="${name} artwork"`), `${name} should name its artwork`)
    assert.match(card, />\s*Open track(?:\s|<)/)
  }
  assert.doesNotMatch(html, /<(?:audio|iframe)\b/i)
})

test("Music lets the artwork carry the page without extra commentary", () => {
  assert.doesNotMatch(html, /class="music-lead"/)
  assert.doesNotMatch(html, /Listening stays in your control/)
  assert.doesNotMatch(html, />12 pieces</)
  assert.doesNotMatch(html, /Keep exploring/i)
  assert.doesNotMatch(html, /Sound can be something you shape/)
  assert.match(html, /aria-label="Portfolio pages"/)
})

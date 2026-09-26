import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const work = await readFile("dist/projects/index.html", "utf8")
const caseStudy = await readFile("dist/projects/pure-data-synthesizer--visualizer/index.html", "utf8")
const moleculeCaseStudy = await readFile("dist/projects/molecule-generation-with-rl/index.html", "utf8")

test("the production Work route renders the approved shared experience", () => {
  assert.match(work, /class="site-header"/)
  assert.match(work, /class="work-page"/)
  assert.match(work, /href="\/projects\/"[^>]*aria-current="page"/)
  assert.match(work, /id="work-vine-canvas"/)
  assert.match(work, /Daily Focus Coach/)
  assert.match(work, /RevoStep Visualization Dashboard/)
  assert.equal((work.match(/<h1(?:\s|>)/g) ?? []).length, 1)
  assert.doesNotMatch(work, /noindex,nofollow/)
  assert.doesNotMatch(work, /Unpublished design preview/)
})

test("Work links to the released case study without preview-only detours", () => {
  assert.match(work, /href="\/projects\/molecule-generation-with-rl\/"/)
  assert.match(work, /href="\/projects\/pure-data-synthesizer--visualizer\/"/)
  assert.doesNotMatch(work, /href="\/synthesizer-preview\/"/)
  assert.doesNotMatch(work, /href="\/work-preview\//)
})

test("Work leads with the evidence-backed molecule case study and keeps parked work secondary", () => {
  const moleculePosition = work.indexOf("Molecule Generation with Reinforcement Learning")
  const synthesizerPosition = work.indexOf("Pure Data Synthesizer + Visualizer")

  assert.ok(moleculePosition >= 0)
  assert.ok(synthesizerPosition > moleculePosition)
  assert.match(work, /id="daily-focus-coach"[\s\S]{0,300}project-status parked">Parked[\s\S]{0,300}<h2>Daily Focus Coach/)
  assert.doesNotMatch(work, /More projects &amp; explorations/)
  assert.doesNotMatch(work, /CPCR DataCatalog/)
})

test("Work explains the case-study standard in recruiter-facing language", () => {
  assert.match(
    work,
    /Each case study shows the question, what I built, what happened, what challenged it, and what comes next\./,
  )
  assert.doesNotMatch(work, /semantic KV-cache|contribution boundaries/i)
})

test("the molecule case study presents evidence, uncertainty, and next actions", () => {
  assert.match(moleculeCaseStudy, /Can reinforcement learning<br><em>improve molecular docking\?<\/em>/)
  assert.match(moleculeCaseStudy, /How the system works/)
  assert.match(moleculeCaseStudy, /My contribution/)
  assert.match(moleculeCaseStudy, /Two seeds\. Two different stories\./)
  assert.match(moleculeCaseStudy, /Seed 44/)
  assert.match(moleculeCaseStudy, /7\.49/)
  assert.match(moleculeCaseStudy, /3\.03/)
  assert.match(moleculeCaseStudy, /Seed 45/)
  assert.match(moleculeCaseStudy, /9\.17/)
  assert.match(moleculeCaseStudy, /8\.94/)
  assert.match(moleculeCaseStudy, /What held the work back/)
  assert.match(moleculeCaseStudy, /What I would test next/)
  assert.match(moleculeCaseStudy, /course collaboration/i)
  assert.match(moleculeCaseStudy, /role="img"/)
  assert.match(moleculeCaseStudy, /github\.com\/emaverick2001\/Molecule-Generation-With-RL/)
  assert.match(moleculeCaseStudy, /not as a published benchmark/i)
  assert.doesNotMatch(moleculeCaseStudy, /<form/)
})

test("the released synthesizer case study keeps the approved design and production return paths", () => {
  assert.match(caseStudy, /class="site-header"/)
  assert.match(caseStudy, /One gesture\./)
  assert.match(caseStudy, /href="\/projects\/">← Back to Work/)
  assert.match(caseStudy, /href="\/projects\/#daily-focus-coach"/)
  assert.doesNotMatch(caseStudy, /noindex,nofollow/)
  assert.doesNotMatch(caseStudy, /Unpublished design preview/)
})

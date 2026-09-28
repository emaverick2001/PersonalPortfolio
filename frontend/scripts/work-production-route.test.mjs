import test from "node:test"
import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"

const work = await readFile("dist/projects/index.html", "utf8")
const caseStudy = await readFile("dist/projects/pure-data-synthesizer--visualizer/index.html", "utf8")
const moleculeCaseStudy = await readFile("dist/projects/molecule-generation-with-rl/index.html", "utf8")

const exists = async (path) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

test("the production Work route renders the approved shared experience", () => {
  assert.match(work, /class="site-header"/)
  assert.match(work, /class="work-page"/)
  assert.match(work, /href="\/projects\/"[^>]*aria-current="page"/)
  assert.match(work, /content="Evidence-backed AI research, creative instruments, and an in-development attention tool\."/)
  assert.doesNotMatch(work, /assistive data work/)
  assert.match(work, /id="work-vine-canvas"/)
  assert.match(work, /Daily Focus Coach/)
  assert.equal((work.match(/<h1(?:\s|>)/g) ?? []).length, 1)
  assert.doesNotMatch(work, /noindex,nofollow/)
  assert.doesNotMatch(work, /Unpublished design preview/)
})

test("Work links to the released case study without preview-only detours", () => {
  assert.match(work, /href="\/projects\/symbiotic-swe\/"/)
  assert.match(work, /href="\/projects\/molecule-generation-with-rl\/"/)
  assert.match(work, /href="\/projects\/semantic-aware-kv-cache-eviction\/"/)
  assert.match(work, /href="\/projects\/pure-data-synthesizer--visualizer\/"/)
  assert.doesNotMatch(work, /href="\/synthesizer-preview\/"/)
  assert.doesNotMatch(work, /href="\/work-preview\//)
})

test("Work leads with the resume-backed and reviewed research stories in approved order", () => {
  const symbioticPosition = work.indexOf("Symbiotic-SWE")
  const moleculePosition = work.indexOf("Molecule Generation with Reinforcement Learning")
  const sackvPosition = work.indexOf("Semantic-Aware Chunk-Level KV Cache Eviction")
  const synthesizerPosition = work.indexOf("Pure Data Synthesizer + Visualizer")

  assert.ok(symbioticPosition >= 0)
  assert.ok(moleculePosition > symbioticPosition)
  assert.ok(sackvPosition > moleculePosition)
  assert.ok(synthesizerPosition > sackvPosition)
  assert.match(work, /id="daily-focus-coach"[\s\S]{0,300}project-status in-progress">In development[\s\S]{0,300}<h2>Daily Focus Coach/)
  assert.doesNotMatch(work, /RevoStep|id="revostep"|href="#revostep"/)
  assert.doesNotMatch(work, /Parked|intentionally parked/i)
  assert.doesNotMatch(work, /More projects &amp; explorations/)
  assert.doesNotMatch(work, /CPCR DataCatalog/)
})

test("Work lets the case studies demonstrate the structure without a generic standard footer", () => {
  assert.doesNotMatch(work, /The standard/i)
  assert.doesNotMatch(
    work,
    /Each case study shows the question, what I built, what happened, what challenged it, and what comes next\./,
  )
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

test("the Symbiotic-SWE case study bounds its result and contribution", async () => {
  const path = "dist/projects/symbiotic-swe/index.html"
  assert.equal(await exists(path), true, "the explicit Symbiotic-SWE route should be built")
  const symbioticCaseStudy = await readFile(path, "utf8")

  assert.match(symbioticCaseStudy, /Can symbolic counterexamples/)
  assert.match(symbioticCaseStudy, /My contribution/)
  assert.match(symbioticCaseStudy, /neural_only/)
  assert.match(symbioticCaseStudy, /neural_slicing/)
  assert.match(symbioticCaseStudy, /neural_solver/)
  assert.match(symbioticCaseStudy, /neural_cegf/)
  assert.match(symbioticCaseStudy, /14-task/)
  assert.match(symbioticCaseStudy, /2 of 14/)
  assert.match(symbioticCaseStudy, /14\.3%/)
  assert.match(symbioticCaseStudy, /5 of 14/)
  assert.match(symbioticCaseStudy, /35\.7%/)
  assert.match(symbioticCaseStudy, /higher token and runtime cost/i)
  assert.match(symbioticCaseStudy, /one repository family/i)
  assert.match(symbioticCaseStudy, /role="img"/)
  assert.match(symbioticCaseStudy, /github\.com\/emaverick2001\/CS-527-Symbiotic-SWE/)
  assert.doesNotMatch(symbioticCaseStudy, /all SWE-bench|production-ready/i)
})

test("the semantic KV-cache case study separates the team result from the individual contribution", async () => {
  const path = "dist/projects/semantic-aware-kv-cache-eviction/index.html"
  assert.equal(await exists(path), true, "the explicit semantic KV-cache route should be built")
  const sackvCaseStudy = await readFile(path, "utf8")

  assert.match(sackvCaseStudy, /five-person course collaboration/i)
  assert.match(sackvCaseStudy, /Aarul Dhawan/)
  assert.match(sackvCaseStudy, /Yu Fu/)
  assert.match(sackvCaseStudy, /Naman Raina/)
  assert.match(sackvCaseStudy, /Keshav Trikha/)
  assert.match(sackvCaseStudy, /My contribution/)
  assert.match(sackvCaseStudy, /offline pipeline/i)
  assert.match(sackvCaseStudy, /chunk-level utility/i)
  assert.match(sackvCaseStudy, /shared offline\/online feature contract/i)
  assert.match(sackvCaseStudy, /50 MuSiQue/)
  assert.match(sackvCaseStudy, /30% eviction/)
  assert.match(sackvCaseStudy, /713/)
  assert.match(sackvCaseStudy, /estimated 654 MB/i)
  assert.match(sackvCaseStudy, /0% quality delta/i)
  assert.match(sackvCaseStudy, /56% latency increase/i)
  assert.match(sackvCaseStudy, /40%/)
  assert.match(sackvCaseStudy, /not production-ready/i)
  assert.match(sackvCaseStudy, /role="img"/)
  assert.doesNotMatch(sackvCaseStudy, /href="[^"]*(?:github\.com\/ktrikha2\/sackv|CS598_Final_Report)/i)
})

test("the released synthesizer case study keeps the approved design and production return paths", () => {
  assert.match(caseStudy, /class="site-header"/)
  assert.match(caseStudy, /One gesture\./)
  assert.match(caseStudy, /href="\/projects\/">← Back to Work/)
  assert.match(caseStudy, /href="\/projects\/#daily-focus-coach"/)
  assert.doesNotMatch(caseStudy, /noindex,nofollow/)
  assert.doesNotMatch(caseStudy, /Unpublished design preview/)
})

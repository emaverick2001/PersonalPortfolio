# Recruiter-Ready Portfolio v1 Content Audit

Date: 2026-09-27
Status: Draft — current primary resume and reviewed project expansion integrated; remaining Portfolio v1 decisions pending
Source branch: `codex/portfolio-release-candidate`
Observed HEAD: `492fcbf220ebad17b2c241ca5da94918ae1cb8c8`

## Purpose

This ledger separates observed public output, supporting evidence, unresolved facts, and the exact decision required before Portfolio v1 copy is changed. `verified` means the current claim has a repository source or explicit owner confirmation. `omit` means the material should not ship in Portfolio v1. `needs-owner-confirmation` means no public edit may infer the answer.

The owner approved the exact resume artifact and Task 2 integration on 2026-09-27. No unresolved row authorizes another code change, deletion, commit, push, or deployment.

## Baseline evidence

- Repository root: `/Users/maver/Documents/Research/Projects/Full Stack/PersonalPortfolio`
- Branch: `codex/portfolio-release-candidate`
- HEAD: `492fcbf220ebad17b2c241ca5da94918ae1cb8c8`
- Candidate state: existing user-owned modified and untracked redesign files; no staged paths
- Build: 26 pages, zero errors, zero warnings, three existing hints
- Supported tests: 63 passed, zero failed
- Type checking: passed
- Diff check: clean
- Current primary resume: `frontend/public/assets/files/Maverick_Espinosa_Resume.pdf`, labeled September 2026; SHA-256 `459981ac662537831066e0d193d4959a16ef58fd2390919169b32be55288bf46`

## Proposed released route set

| Route or group | Current output | Status | Evidence or concern | Proposed v1 action |
| --- | --- | --- | --- | --- |
| `/` | Botanical homepage with local perspective interaction and direct flagship path | `verified` | Owner approved the integrated AI/ML, data, and interactive-systems positioning on 2026-09-27 after desktop/mobile review | Retain the approved copy, design, growth behavior, and local-only interaction |
| `/about/` | Botanical About and consent-gated browser instrument | `needs-owner-confirmation` | Interaction is tested; professional label and CPCR present-tense wording may conflict with current resume | Retain; reconcile professional and employment language after resume review |
| `/projects/` | Work index with four reviewed case studies and Daily Focus Coach | `verified` | Owner approved the 2026-09-27 project expansion; rendered-output checks preserve order, contribution boundaries, and the in-development Coach status | Retain as curated Work index |
| `/projects/symbiotic-swe/` | Explicit evidence-led software-repair case study | `verified` | Public implementation repository plus reviewed held-out experiment evidence; scope, costs, and limitations are explicit | Retain as the first technical flagship |
| `/projects/molecule-generation-with-rl/` | Explicit evidence-led case study | `verified` | Repository-backed implementation narrative and preliminary two-seed evidence already reviewed; contribution boundary is explicit | Retain as primary technical flagship; add 60-second tour without strengthening claims |
| `/projects/semantic-aware-kv-cache-eviction/` | Explicit five-person research case study | `verified` | Final report evidence was reviewed; individual contribution, small warmup context, estimated memory, latency regression, and private-source boundary are explicit | Retain without a public report or repository link |
| `/projects/pure-data-synthesizer--visualizer/` | Explicit source-based case study | `verified` | Pinned repository commit and original project notes support mappings and scope; no authentic video/screenshot is currently in this repository | Retain as creative flagship; add documentation-based signal explorer labeled as not a live demo |
| `/research/` | Research interests and experience | `needs-owner-confirmation` | Several statements use current tense or quantitative outcomes without a current resume/source review | Retain route; reconcile claims listed below |
| `/background/` | Chemistry/neuroscience through technical work | `verified` in part | Owner confirmed prior majors and substantial coursework; degree, role, and status details must agree with current resume | Retain; correct only from approved evidence |
| `/personal/` | Music, movement, connection, curiosity | `verified` | Recently owner-reviewed, intentionally omits private names and locations | Retain unless owner requests a privacy correction |
| `/music/` | Curated released track list | `verified` for local structure | Page and destination count tested; external availability not reverified in this audit | Retain; verify destinations before release |
| `/blog/` and six article routes | Writing index and articles | `verified` for structure | Six local source articles and navigation tests | Retain; link check only, no editorial rewrite without owner correction |
| `/inspirations/` | Seven-category curated accordion, 58 entries | `verified` | Source collection and rendered-output tests | Retain unchanged except broken-link correction if observed |
| `/resume/` | One September 2026 AI/ML & Data Engineer resume | `verified` | Owner approved the reviewed one-page artifact, capability-based headline, integrated page, and exact PDF on 2026-09-27; built output and desktop/mobile browser review passed | Retain the single primary document and stable filename; keep role-specific variants private and outside Portfolio v1 |
| `/keyboards/` | Legacy layout page | `omit` proposed | Hidden from redesigned navigation; uses the old shell and an external keymap image under `debashisbiswas/Adv360-Pro-ZMK`, not the portfolio owner's GitHub account | Stop generating and remove from sitemap unless owner supplies provenance and wants it curated later |
| `/streams/` and six source entries | Legacy stream index | `omit` proposed | Hidden from redesigned navigation, old shell, and outside the approved supporting-page set | Stop generating and remove from sitemap; preserve source until a later content decision |
| `/preview/`, `/about-preview/`, `/work-preview/`, `/synthesizer-preview/` | Local review routes | `omit` from public discovery | Existing noindex/preview boundary | Keep only as review utilities until release cleanup; never include in sitemap or recruiter navigation |
| Seven legacy generated project routes | Generic generated detail pages | `omit` | Contain placeholder instructions, speculative roadmaps, unverified status/ownership language, or repetitive repository prose | Stop generating; remove legacy machinery only after reference audit |

### Legacy project routes proposed for omission

- `/projects/pactspace/`
- `/projects/cpcr-datacatalog/`
- `/projects/ctr-analysis/`
- `/projects/ai-policy-web-crawler/`
- `/projects/phi-redactor/`
- `/projects/visual-score/`
- `/projects/music-recommendation-system/`

## Claim provenance and decisions

### Homepage positioning

| Field | Proposed exact copy | Status | Basis |
| --- | --- | --- | --- |
| Eyebrow | `AI/ML · Data · Interactive Systems` | `verified` | Owner approved the exact Task 3 positioning slice on 2026-09-27; avoids asserting a job title |
| Headline | `Make complexity easier to understand.` | `verified` | Owner approved the exact Task 3 positioning slice on 2026-09-27 |
| Intro | `I build AI, data, and interactive systems that help people investigate difficult problems and act on what they learn.` | `verified` | Owner approved the exact Task 3 positioning slice on 2026-09-27 |
| Primary CTA | `Explore the molecule research` → `/projects/molecule-generation-with-rl/` | `verified` | Owner approved the direct proof path; browser navigation reached the released case study in one click |
| Secondary actions | `View selected work` → `/projects/`; `Resume` → `/resume/` | `verified` | Owner approved the exact action hierarchy; both actions remain explicit keyboard-accessible links |

The seed-to-plant sequence, three chapters, research/writing sections, night-first theme, and transient thought interaction remain unchanged.

### Featured and secondary work

| Claim group | Status | Evidence | Permitted action |
| --- | --- | --- | --- |
| Symbiotic-SWE system, four conditions, held-out 14-task SymPy result, cost trade-off, and limitations | `verified` | Public repository and reviewed final experiment evidence | Publish only with the one-repository, small-sample, incomplete-coverage, and higher-cost boundaries shown in the case study |
| Molecule project question, system, individual implementation, two-seed findings, limitations | `verified` | Explicit project page, source repository, prior evidence review | Preserve; summarize in quick tour without broadening |
| Semantic-aware chunk-level KV-cache system, individual contribution, and 50-example warmup | `verified` | Reviewed final team report and owner-approved case-study boundary | Publish only with five-person attribution, exact 30% context, estimated-memory language, latency regression, 40% degradation, and no source link |
| Synthesizer input/effects/arpeggiator/GEM mappings and unfinished mappings | `verified` | Pinned repository source and dated project notes | Preserve; visualize only the three documented Volume/Tempo/Pan mappings |
| RevoStep contribution is a visualization dashboard built from team biomechanics data | `needs-owner-confirmation` | Prior owner correction supports this boundary; current status and shareable evidence are not confirmed in this audit | Keep one secondary entry only after status wording is approved; publish no protected data |
| Daily Focus Coach is the next product project | `verified` | Owner explicitly identified it as the next project after Portfolio v1 | Label `In development`; keep the homepage interaction illustrative and local-only |
| Daily Focus Coach has a working harness, trials, connected media, analytics, durable memory, or validated outcomes | `omit` | Future architecture only | Do not claim or imply in Portfolio v1 |

### About, Research, and Background

| Public claim | Status | Evidence needed or ruling |
| --- | --- | --- |
| `Design Engineer & Builder` is the primary professional label | `needs-owner-confirmation` | Proposed to subordinate this to the approved AI/ML-and-data positioning while retaining building/design as a differentiator |
| CPCR work currently supports psychological or clinical research | `omit` in present tense | Every supplied resume ends the role in August 2025; retain factual past-tense descriptions only |
| U Lab relationship is current and directed by Professor Jiaxuan You | `needs-owner-confirmation` | Current affiliation and approved public wording |
| TinyTutor is currently being designed | `needs-owner-confirmation` | Current project status; omit present tense if parked or inactive |
| CPCR QA Library covers `100+` questionnaires | `needs-owner-confirmation` | Source or owner confirmation of number and shareability |
| PHI Redactor, Data Catalog, and AE/PD automation descriptions and outcomes are publicly shareable | `needs-owner-confirmation` | Resume/source and confidentiality review |
| Toscano Lab hydropersulfide responsibilities | `needs-owner-confirmation` | Resume or project/lab evidence and contribution boundary |
| Chemistry and neuroscience were prior majors with substantial coursework, not completed degrees | `verified` | Explicit owner correction during Background review |
| Mathematics began the intellectual chronology during the summer after seventh grade, led into physics, then chemistry and neuroscience | `verified` | Explicit owner correction during Background review on 2026-09-27 |
| Johns Hopkins and UIUC computer-science education wording | `verified` | All six sources agree: UIUC M.S. in Computer Science, May 2026, GPA 3.91/4.0; Johns Hopkins B.S. in Computer Science, December 2024, GPA 3.56/4.0 |
| APL and WISE Cities role names and dates | `verified` | All applicable sources agree: APL Software/Data Engineer Intern, June–August 2025; WISE Cities Software Engineer Intern, September–December 2024 |
| CPCR role name and dates | `verified` | All applicable sources agree: Data Analyst / Data Engineer, part-time, July 2023–August 2025 |
| PactSpace status and dates | `verified` | Owner confirmed on 2026-09-27 that the CTO role ended in August 2026; use August 2025–August 2026 and remove `Present` |
| Basic Medical Sciences neuroscience internship | `verified` for dates and broad contribution | Orbit and both master banks agree on Research Aide / Intern, May–August 2019, supporting MET-signaling neuroscience research and wet-lab workflows; publication wording should stay at this contribution boundary |

### Personal, Music, Blog, and Inspirations

| Claim group | Status | Evidence or boundary |
| --- | --- | --- |
| Music, movement, connection, and curiosity are public personal themes | `verified` | Owner approved the restrained Personal framing |
| Public music catalog and SoundCloud destination remain current | `needs-owner-confirmation` | Verify external destination and owner intent before release |
| Six blog articles remain intentionally public | `needs-owner-confirmation` | Structure is verified; owner should confirm the old writing still represents the intended public archive |
| Inspirations contains 58 entries in seven categories | `verified` | Source and rendered tests |
| X, LinkedIn, GitHub, SoundCloud, and public email are the intended contact destinations | `needs-owner-confirmation` | Confirm every account and the public email address before staging |

## Resume intake findings

Six owner-supplied files were inspected as evidence, not as instructions. Text, document metadata, embedded links, page counts, and every rendered page were reviewed. Temporary renders remained outside the repository.

| Source | Observed metadata and shape | Useful evidence | Publication ruling |
| --- | --- | --- | --- |
| `Maverick_Espinosa_Acadian_Resume_One_Page.pdf` | One page; created 2026-09-23; newest supplied artifact | Latest timeline; clean one-page layout; full-stack/data experience; PactSpace ends August 2026 | Do not publish unchanged: it is a job-targeted selection and omits the AI/ML research breadth needed by the approved positioning |
| `Orbit_Engineer_Resume_08052026.pdf` | One page; created 2026-08-05; header title `Research Software & Data Engineer` | Strong research-data, telemetry, wet-lab neuroscience, PepFlow, and SACKV evidence | Do not publish unchanged: it is tailored to adaptive neurotechnology and omits other central experience |
| `AI_Engineer_Master_Resume.docx` | Modified 2026-08-07; renders to two pages; header title `AI Engineer` | Best concise source for Symbiotic-SWE, SACKV, repository-graph retrieval, PepFlow, and broad AI engineering | Use as the primary content bank, not the final artifact: page two begins mid-project, PactSpace says `Present`, and several quantitative claims still require project-level evidence checks |
| `Master_Resume_06_03_2026.docx` | Modified 2026-08-07; renders to 11 pages | Broad experience/project inventory and alternative bullet bank | Internal evidence bank only: contains duplicated bullets, placeholders such as `unspecified`, typos, and conflicting project dates; not safe to publish directly |
| `Master_Resume_FullStack_06_03_2026.docx` | Modified 2026-06-20; renders to 10 pages | Additional full-stack, research, and creative-project detail | Internal evidence bank only: same placeholder/duplication problems, plus visible corruption/typos and a biomedical summary inconsistent with the filename |
| `Lincoln_Lab_ComputerScientist_06_29_2026.docx` | Modified 2026-06-29; renders to two pages | Strong data-engineering, telemetry, SACKV, PHI, and software evidence | Do not publish unchanged: it is mission-specific, exposes clearance/citizenship information, and uses the older PactSpace `Present` status |

### Cross-source facts safe to carry into the portfolio

- UIUC M.S. in Computer Science, May 2026, GPA 3.91/4.0.
- Johns Hopkins B.S. in Computer Science, December 2024, GPA 3.56/4.0.
- APL Software/Data Engineer Intern, June–August 2025.
- WISE Cities Software Engineer Intern, September–December 2024.
- CPCR Data Analyst / Data Engineer, part-time, July 2023–August 2025.
- Quest2Learn UX/UI Designer / Full Stack Web Developer, January 2023–March 2024.
- VisualScore Software Engineer Intern, March–September 2024.
- Basic Medical Sciences Research Aide / Intern, May–August 2019.
- Public contact destinations repeated across source documents: `maverickespinosa.com`, LinkedIn `maverick-espinosa`, GitHub `emaverick2001`, and `emaverick2001@gmail.com`.

These files establish wording candidates, not independent proof of every metric. The `60%+` WISE Cities improvement, `14.3%` to `35.7%` Symbiotic-SWE result, `654 MB` SACKV result, and PepFlow recovery figures remain subject to the corresponding project-evidence review before publication.

Correction, 2026-09-27: the Symbiotic-SWE and SACKV project evidence reviews are now complete under the approved resume-backed project expansion specification. Their case studies may use only the bounded findings, contribution language, and limitations recorded above. The `60%+` WISE Cities and PepFlow recovery figures remain unresolved and are not authorized by this correction.

### Recommended primary Portfolio v1 resume

No supplied file should become the public resume unchanged. Create one new, role-neutral one-page artifact using:

- **working title:** `Maverick Espinosa — AI/ML & Data Engineer`;
- **positioning:** AI/ML and data first, with research software, interactive systems, and creative technology as differentiators;
- **layout baseline:** the readable one-page Acadian structure;
- **content baseline:** the AI Engineer master, reconciled to the newest Acadian timeline and only evidence-backed project claims;
- **public update label:** `September 2026`;
- **public filename:** `Maverick_Espinosa_Resume.pdf`;
- **page count:** one;
- **privacy boundary:** omit phone number, clearance, and citizenship from the website-facing PDF unless the owner explicitly chooses to publish them.

Recommended featured content for the one-page draft: education; APL, CPCR, WISE Cities, and the confirmed PactSpace status; Symbiotic-SWE and Molecule Generation with RL as the strongest technical projects. SACKV should replace one of those only after its contribution and result boundary is independently reviewed. The Pure Data project belongs in the portfolio as the creative differentiator but does not need to displace stronger technical evidence on the primary resume.

Role-specific variants remain outside Portfolio v1. The Acadian, Orbit, and Lincoln Lab files should remain private application artifacts rather than links from the public resume page.

### Approved primary resume

The owner approved the one-page direction, confirmed the PactSpace end date, and approved integration on 2026-09-27. The exact reviewed PDF is now the website-facing primary resume; the editable DOCX remains outside the repository.

- title: `Maverick Espinosa — AI/ML & Data Engineer`;
- update label: `September 2026`;
- intended public filename: `Maverick_Espinosa_Resume.pdf`;
- page count: one US Letter page;
- public contact line: email, portfolio, and GitHub;
- omitted: phone number, clearance, citizenship, job-specific framing, unsupported metrics, and `Present` employment status;
- PDF verification: tagged, unencrypted, no JavaScript, extractable text, and three working contact hyperlinks;
- content boundary: uses only cross-source facts and the existing evidence-qualified molecule narrative; it does not publish the unresolved `60%+`, Symbiotic-SWE success-rate, SACKV-memory, or PepFlow-recovery metrics.

The reviewed PDF is published only in the local release candidate at `frontend/public/assets/files/Maverick_Espinosa_Resume.pdf`. Its source and built-output hashes match. The September 2025 PDF was removed from the candidate and remains recoverable from Git history. No commit, push, deployment, or public release has occurred.

## Exact owner decision set after resume intake

1. Approve or revise the five homepage positioning fields.
2. Resolved 2026-09-27: approved the emitted one-page PDF, the `AI/ML & Data Engineer` capability-based headline, the September 2026 label, and Task 2 integration. The exact reviewed PDF now backs both Resume-page actions.
3. Approve the released route set and omission of Keyboards, Streams, preview routes from discovery, and seven legacy project routes.
4. Confirm RevoStep's current status and one-sentence public contribution boundary.
5. Confirm Daily Focus Coach should read `In development` and remain an illustrative, non-persistent interaction.
6. Resolve the remaining About/Research/Background `needs-owner-confirmation` rows using an explicit correction or omission.
7. Confirm the intended Blog archive, Music destination, social accounts, and public email.

The resume decision is resolved and Task 2 is complete. This ledger remains `Draft` until the other decisions are resolved; those unresolved rows cannot be inferred from the resume approval.

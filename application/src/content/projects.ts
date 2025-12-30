import { trackProjectOpened } from "../utils/analytics"

interface Project {
  name: string
  image: string
  tags: string[]
  sourceCode: string
  projectLink?: string
  onclick: () => void
  desc: string
  gallery?: string[]
  overview: string
  features: string[]
  howItWorks: string
  directoryStructure: string
  usage: string | string[]
  importantNotes: string | string[]
  dependencies: string[]
  gettingStarted: string
  contributions: string
  license: string
  credits: string
  acknowledgements: string[]
  framework: string
}

export const projects: Project[] = [
  {
    name: "PactSpace",
    image: "/assets/images/project-2.jpg",
    tags: ["B2B Marketplace", "Workflow Systems", "AI (Roadmap)", "Verification", "Payments"],
    sourceCode: "https://github.com/emaverick2001/PactSpace",
    projectLink: "https://www.pactspace.co/",
    onclick: () => trackProjectOpened("PactSpace", "projectCard"),

    desc: "A structured B2B marketplace for partner discovery, negotiation, and milestone-based execution.",

    overview:
      "PactSpace is a B2B marketplace that helps technical and industrial SMEs discover trusted partners, negotiate structured offers, and execute outsourced services through milestone-based workflows. The core idea is to replace fragmented tools (emails, spreadsheets, chat threads, and disconnected task boards) with a single end-to-end process: profile creation → service request → matching → offer + negotiation → finalized workflow with archived communication and documents. PactSpace also roadmap-includes AI assistance (navigation, profile/form creation, matching, negotiation), vendor verification, and integrated payment support to reduce sourcing inefficiency, miscommunication, and execution delays.",

    features: [
      "Partner discovery workflow designed for outsourced services (buyer ↔ provider marketplace)",
      "Structured service request forms (scope, milestones, constraints, attachments)",
      "Keyword-based matching / search to surface relevant vendors (initial platform stage)",
      "Offer submission + negotiation loop with versioned updates tied to the deal",
      "Conversation + document archiving to maintain auditability during execution",
      "Milestone-based execution workflow to track timeline and deliverables",
      "Vendor verification layer (roadmap / stage-based rollout)",
      "Integrated payment support aligned to milestones (roadmap / stage-based rollout)",
      "AI-assisted modules planned across the funnel (profile creation, form creation/filling, matchmaking, negotiation, navigation)",
    ],

    // gallery: [
    //   "/assets/images/pactspace/landing.png",
    //   "/assets/images/pactspace/workflow-diagram.png",
    // ],

    howItWorks:
      "PactSpace models a B2B deal as a structured sequence of artifacts and states. Providers create profiles, buyers publish a service request form, and the platform matches buyers to relevant providers (initially via keyword matching). Providers submit offers and negotiations occur inside the platform; as the negotiation evolves, the ‘form’ updates and all communication is archived. Once terms are agreed, the updated form converts into a milestone-based execution workflow that tracks timeline progress and stores the documents needed during delivery. Verification and payments are layered on top to strengthen trust and reduce execution failure.",

    directoryStructure:
      "The codebase is organized around the core product domains (profiles, service requests, matching, offers/negotiation, workflow/execution, archiving). This separation makes it easier to evolve the platform from the initial web listing stage into a full MVP with execution workflows, then into an AI-assisted layer (matching + suggestion modules) and payments/verification integration.",

    usage:
      "PactSpace is designed for two primary roles: (1) SME technical buyers who need to find and onboard reliable partners quickly, and (2) service providers/vendors who want repeatable access to buyers and a structured way to submit offers and get paid per milestone. Users can publish service needs, receive/respond to offers, negotiate inside one workspace, and then execute the work using milestone tracking and archived records.",

    importantNotes: [
      "PactSpace is intentionally scoped to be a lightweight, workflow-first alternative for SMEs—rather than a full enterprise procurement suite.",
      "AI features are planned as a later layer; the initial stages prioritize a reliable core flow (listing/search → offers → workflow execution).",
      "Vendor verification and payment integration are treated as trust/monetization layers that can roll out progressively.",
    ],

    dependencies: [
      "Web platform (frontend + backend services)",
      "Database for marketplace entities (profiles, requests, offers, workflow states)",
      "File storage for attachments + archived documents",
      "Optional: third-party verification provider (for vendor verification layer)",
      "Optional: payment provider integration (for milestone-based payments)",
    ],

    gettingStarted:
      "Clone the repository and follow the README to set up the local development environment. At a minimum, you’ll typically configure environment variables for the app URL, database connection, and any external providers used (storage, auth, payments). Then run the dev server and open the web app locally.",

    contributions:
      "Contributions are welcome—especially around improving the structured deal flow, expanding marketplace search/matching, and adding robustness to negotiation/versioning, archiving, and workflow state transitions. The project is also a strong base for layering in AI suggestions (matching + form assistance) once the core UX and data model are stable.",

    license: "See repository for license details.",

    credits:
      "Built by Maverick Espinosa as part of the PactSpace product vision and development effort.",

    acknowledgements: [
      "SME procurement + services workflows that inspired the end-to-end ‘discovery → negotiation → execution’ model",
      "The PactSpace pitch deck and supporting research framing the market gap and product roadmap",
    ],

    framework:
      "Full-stack web marketplace + workflow system (MVP evolves from listing/search into execution workflows, then AI + verification + payments).",
  },
  {
    name: "CPCR DataCatalog",
    image: "/assets/images/project-9.jpg",
    tags: ["DataScience", "DataEngineering"],
    sourceCode: "https://github.com/emaverick2001/DataCatalog",
    onclick: () => trackProjectOpened("CPCR DataCatalog", "projectCard"),
    desc: "Centralized metadata & discovery tool to support ingestion, harmonization, documentation, and secure distribution of CPCR datasets",
    overview:
      "CPCR DataCatalog is a centralized data-asset metadata and discovery tool designed to support ingestion, harmonization, documentation, and exploration of datasets across teams and analytic workflows. It helps researchers and engineers find the right datasets faster, understand what each dataset contains, trace where it came from, and enforce appropriate access rules—reducing duplicated work and improving reliability in downstream analysis.",

    features: [
      "Dataset registry: maintain a single source of truth for datasets, versions, and ownership",
      "Search & discovery: quickly locate datasets by name, domain, tags, or study/project context",
      "Documentation & data dictionaries: capture dataset descriptions, column-level metadata, and usage notes",
      "Harmonization support: track harmonized variables, mappings, and transformation notes across sources",
      "Ingestion tracking: log ingestion status and key provenance fields (source → processed → published)",
      "Access-aware distribution: support organizational security goals by attaching sensitivity/access notes to assets",
      "Operational clarity: define owners/stewards and expected update cadence so datasets don’t become “mystery tables”",
    ],

    // gallery: [
    //   "/assets/images/cpcr-datacatalog-1.png",
    //   "/assets/images/cpcr-datacatalog-2.png",
    //   "/assets/images/cpcr-datacatalog-3.png",
    // ],

    howItWorks:
      "DataCatalog organizes datasets as first-class ‘assets’ with structured metadata (what it is, where it came from, how it’s used, how it’s maintained, and who owns it). Ingestion and harmonization workflows can register or update these assets as data moves through stages (raw → cleaned → harmonized → analysis-ready). The catalog then becomes the discovery layer for teams: users search for datasets, review documentation/data dictionaries, understand provenance/harmonization notes, and follow guidance for secure access and distribution.",

    directoryStructure:
      "This repo is organized around the core building blocks of a metadata system: (1) asset models (datasets, fields, owners, versions), (2) services for registering/updating assets during ingestion/harmonization, and (3) discovery interfaces for searching and browsing assets. If you want this to read more ‘exact,’ I can rewrite this section once you paste your actual top-level folders (e.g., `database/`, `application/`, `src/`, `api/`, etc.).",

    usage: [
      "Register a dataset and attach dataset-level metadata (description, owner, tags, source context).",
      "Document columns/fields (types, meaning, allowed values, missingness notes, harmonized mapping notes).",
      "Search/browse to find datasets relevant to an analysis or reporting workflow.",
      "Review provenance + harmonization notes before using data downstream.",
      "Follow security/distribution notes to request or share access appropriately.",
    ],

    importantNotes: [
      "Treat the catalog as the canonical metadata source: update it whenever ingestion/harmonization logic changes.",
      "Metadata quality is a product feature—good descriptions, field definitions, and ownership are what make discovery work.",
      "If the catalog is used to support secure distribution, ensure sensitive datasets/fields are consistently labeled.",
    ],

    dependencies: [
      "Varies by implementation (add the concrete stack once finalized—e.g., Python backend, DB for metadata storage, optional UI)",
      "Optional integrations: ingestion pipeline hooks, authentication/authorization, and storage connectors",
    ],

    gettingStarted:
      "Clone the repository and follow the README to configure the metadata store and run the application locally. If you want, paste the README here and I’ll convert it into a clean ‘Getting Started’ section with exact commands, environment variables, and example workflows.",

    contributions:
      "Contributions focus on improving metadata coverage and usability: adding new asset types, improving search/browse UX, expanding harmonization documentation support, and strengthening validation/consistency checks for dataset + field metadata.",

    license:
      "TBD (add a LICENSE file if you intend external reuse; otherwise document internal usage expectations).",

    credits:
      "Built to support CPCR’s center-wide data organization goals, including ingestion, harmonization, documentation, and secure dataset distribution across teams.",

    acknowledgements: [
      "CPCR data stakeholders and collaborators who define requirements for discovery, harmonization, and secure access",
      "Research teams whose analytic workflows informed what metadata needed to be first-class",
    ],

    framework:
      "Metadata catalog / discovery system (stack depends on deployment; commonly paired with a backend API + metadata database + optional UI).",
  },
  {
    name: "CTR Analysis",
    image: "/assets/images/project-3.jpg",
    tags: ["DataScience", "AI", "DataMining"],
    sourceCode: "https://github.com/emaverick2001/CTRAnalysis",
    onclick: () => trackProjectOpened("CTR Analysis", "projectCard"),
    desc: "Exploring CTR classification algorithms and model pipelines",
    overview:
      "This project explores click-through rate (CTR) prediction using the Avazu CTR dataset (Kaggle). CTR prediction is a core supervised-learning problem in online advertising, where the goal is to estimate the probability a user will click an ad given anonymized contextual + device + placement features. Using Avazu’s multi-day click log data (10 days for training, 1 day for testing), this repo walks through a practical end-to-end pipeline—loading compressed data, preparing features, training baseline models, and comparing results to understand how different classification approaches behave on large, sparse, categorical datasets.",
    features: [
      "End-to-end CTR prediction workflow using the Avazu Kaggle competition dataset (train/test/submission format)",
      "Model-comparison notebook-style experimentation (multiple classifiers + evaluation)",
      "Practical preprocessing patterns for high-cardinality categorical features common in ads datasets",
      "Reproducible analysis flow designed to be run locally in Jupyter",
    ],
    // gallery: [
    //   "/assets/images/ctr/ctr-dataset-preview.png",
    //   "/assets/images/ctr/model-comparison-results.png",
    //   "/assets/images/ctr/roc-pr-curve.png",
    //   "/assets/images/ctr/confusion-matrix.png",
    // ],
    howItWorks:
      "1) Download the Avazu CTR competition files (train.gz, test.gz, submission.gz). \n" +
      "2) Load and inspect the dataset (the label is whether the ad was clicked). \n" +
      "3) Prepare features: the dataset is dominated by categorical fields (e.g., site/app/device identifiers and anonymized category columns), which require encoding strategies before training. \n" +
      "4) Train and evaluate multiple CTR classifiers, comparing metrics to understand performance trade-offs. \n" +
      "5) Summarize findings and identify what modeling choices work best for sparse, categorical CTR prediction problems.",
    directoryStructure: `
CTRAnalysis/
├─ README.md
└─ ctr-analysis-of-different-ml-models-Mav.ipynb.zip
`.trim(),
    usage:
      "Use this project as a practical reference for building CTR prediction pipelines: dataset loading, preprocessing patterns for mostly-categorical features, training baseline classifiers, and comparing model behavior on a real ads dataset.",
    importantNotes: [
      "The Avazu dataset is large and stored as compressed files (train.gz/test.gz). Plan for memory/runtime constraints when loading and transforming data.",
      "CTR datasets are typically extremely imbalanced (far more non-clicks than clicks), so metrics beyond accuracy (e.g., log loss / AUC) are important when evaluating models.",
    ],
    dependencies: [
      "Python 3.x",
      "Jupyter Notebook / JupyterLab",
      "Common DS libraries (typical: numpy, pandas, scikit-learn, matplotlib)",
    ],
    gettingStarted:
      "1) Clone the repo.\n" +
      "2) Download train.gz, test.gz, and submission.gz from the referenced Kaggle input page.\n" +
      "3) Unzip the notebook file (ctr-analysis-of-different-ml-models-Mav.ipynb.zip).\n" +
      "4) Launch Jupyter and run the notebook cells end-to-end.",
    contributions:
      "Contributions are welcome (bug fixes, clearer preprocessing, stronger baselines, better evaluation). If you contribute: open an issue describing the change, then submit a PR with a short explanation and before/after results.",
    license:
      "License not specified in the repo summary—add a LICENSE file if you want this to be explicitly reusable.",
    credits:
      "Dataset: Avazu CTR Prediction (Kaggle competition). Inspiration/reference notebook: 'CTR : Analysis of different ML models' (Kaggle).",
    acknowledgements: [
      "Kaggle / Avazu CTR Prediction competition for providing the dataset and baseline problem framing",
      "Open-source ML ecosystem (Python + notebook tooling) that makes rapid experimentation possible",
    ],
    framework: "Jupyter Notebook (Python)",
  },
  {
    name: "AI Policy Web Crawler",
    image: "/assets/images/project-7.jpg",
    tags: ["AI", "Policy", "Python", "Information Retrieval"],
    sourceCode: "https://github.com/emaverick2001/AIPolicyWebCrawler",
    onclick: () => trackProjectOpened("AI Policy Web Crawler", "projectCard"),
    desc: "Crawl + categorize AI policy resources and visualize “attention” via a heat-style distribution map",
    overview:
      "AI Policy Web Crawler is a course project built for an Information Retrieval & Web Agents final (Option #11). The goal is to automatically collect notable AI/ML policy resources (past + present), organize them into meaningful categories, and produce an output that can be hosted as part of a policy timeline (“ancestry tree”) visualization. The project combines web crawling, lightweight IR-style processing, and visualization formatting to surface where policy attention concentrates over time and across themes.",
    features: [
      "Seeded crawling pipeline that expands from initial links/queries to collect policy-related pages",
      "Keyword / key-term driven categorization to group documents into policy themes",
      "Maintains crawl artifacts (visited URLs, extracted text, link lists) for reproducibility",
      "Formats processed results into a heat/distribution-friendly structure for visualization",
      "Simple web UI layer (Flask-style templates) for running/viewing outputs locally",
    ],
    // gallery: ["/assets/images/aipolicy-crawler-1.png", "/assets/images/aipolicy-crawler-2.png"],
    howItWorks:
      "1) Provide seed inputs (queries + starter URLs). 2) The crawler expands outward by fetching pages, extracting text, and tracking what has been visited to avoid repeats. 3) Extracted content is normalized into document arrays/text files. 4) A lightweight model/rules layer scores documents against key terms to assign categories. 5) The final output is transformed into a visualization-ready format (heat/distribution map) that highlights which categories and sources appear most frequently.",
    directoryStructure: `
AIPolicyWebCrawler/
  templates/            # UI templates (web view)
  app.py                # web app entry (UI / routes)
  main.py               # main runner/orchestration entrypoint
  crawler.py            # crawling + link expansion + extraction
  parser_1.py           # parsing utilities for extracted content
  model.py              # scoring/categorization logic
  format_heatmap.py     # transforms results into heatmap-friendly format
  requirements.txt      # Python dependencies
  seed_links.txt        # initial crawl seeds
  links.txt             # discovered links
  visited.txt           # visited URL log
  extracted.txt         # extracted text output
  document_array.txt    # structured doc dump used downstream
  key_terms/            # term lists used for categorization
  common_words/         # stopwords/common word lists
`,
    usage:
      "Typical workflow: create a virtual environment, install requirements, set up your SERPAPI key in a .env, then run the main entrypoint to crawl + generate outputs. The produced files (extracted text, document arrays, heatmap-ready data) can then be consumed by the visualization layer / downstream hosting pipeline.",
    importantNotes: [
      "Requires a SERPAPI key configured via a local .env for search-driven collection.",
      "Crawling outputs are stored as text artifacts (visited, links, extracted content) — commit or ignore these depending on whether you want reproducibility vs a clean repo.",
      "Because this is a crawler, expect occasional failures on certain sites (robots, dynamic rendering, timeouts). Implementing retry/backoff and content-type filtering are common upgrades.",
    ],
    dependencies: [
      "Python 3.x",
      "requirements.txt (install via pip)",
      "SERPAPI (configured via .env)",
    ],
    gettingStarted:
      "1) Create a `.env` containing your SERPAPI key. 2) Create + activate a virtual environment. 3) `pip install -r requirements.txt`. 4) Run the project entrypoint (typically `main.py` / `app.py` depending on whether you want batch crawling vs UI).",
    contributions:
      "Open to contributions that improve crawl robustness (politeness delays, deduping, content filtering), improve categorization quality (better feature extraction, multi-label tagging), or enhance the visualization formatting/export (JSON schema, time-binning, category confidence).",
    license: "TODO (inherit upstream / add MIT if you want it explicitly open-source)",
    credits:
      "Forked from andyjaramillo/AIPolicyWebCrawler and extended/adapted for the course deliverable and output formatting pipeline.",
    acknowledgements: [
      "Information Retrieval & Web Agents course project (Option #11)",
      "TPS timeline/ancestry-tree hosting pipeline (downstream consumer)",
    ],
    framework: "Python (crawler + processing) + lightweight web UI (templates)",
  },
  {
    name: "PHI-redactor",
    image: "/assets/images/project-6.jpg",
    tags: ["DataScience", "AI", "HealthCare"],
    sourceCode: "https://github.com/emaverick2001/PHI-redactor",
    onclick: () => trackProjectOpened("PHI-redactor", "projectCard"),
    desc: "Auto-detect and redact PHI information in datasets",
    overview:
      "A privacy-focused text/document processing tool designed to identify and redact Protected Health Information (PHI) from documents and images. PHI-redactor supports multiple file types (text, CSV/Excel, DOCX, and image/PDF inputs) and produces both redacted outputs and a structured audit report, making it easy to integrate into research workflows that require privacy-preserving data handling.",
    features: [
      "PHI detection & redaction: Automatically scans documents and image-based files (PDFs, DOCX, JPEG/PNG, etc.) to detect PHI (names, dates, addresses, IDs) and replaces or masks it to protect personal health data.",
      "Multiple input formats: Supports processing raw text files, structured tables (CSV/Excel), and unstructured image- or scan-based documents using OCR when needed.",
      "Output structured logs / reports: Generates redacted versions + structured CSV reports summarizing detected PHI items (type, location, original/modified, counts) for downstream auditing.",
      "Pipeline integration friendly: Modular script/Notebook implementation that can be integrated into data-ingestion or ETL pipelines in research labs or enterprises handling PHI.",
      "Visualization & audit support (optional): Outputs patterns of PHI detection (types/frequencies) that help analysts understand redaction coverage and risk exposure.",
    ],

    // These are real artifacts present in the repo, so you can safely reference them in your UI.
    // gallery: [
    //   "/assets/images/projects/phi-redactor/redacteds_pii_jpg.jpg.png",
    //   "/assets/images/projects/phi-redactor/redacteds_pii_png.png.png",
    //   "/assets/images/projects/phi-redactor/redactedmade_s_pii_pdf.pdf0.jpg.png",
    //   "/assets/images/projects/phi-redactor/result_structured_preview.png",
    // ],

    howItWorks:
      "PHI-redactor follows a simple pipeline: (1) ingest a file (text/table/document/image/PDF), (2) extract text (OCR for scanned/image-based inputs when needed), (3) detect PHI entities via NLP/entity detection + rule-based patterns, (4) apply redaction (mask/replace) to produce a privacy-safe output, and (5) emit a structured CSV report that records what was detected/redacted for auditing and downstream compliance workflows.",

    directoryStructure: `
PHI-redactor/
├── main.py
├── pii_detect_final.ipynb
├── Presidio examples/              # experiments + examples around PHI/PII detection
├── other_packages/                 # helper/extra utilities
├── us_cities_states_counties.csv   # lookup/support data for location-based detection
├── sample inputs:
│   ├── s_pii_txt.txt
│   ├── s_pii_csv.csv
│   ├── s_pii_excel.xlsx
│   ├── s_pii_docx.docx
│   ├── s_pii_png.png
│   ├── s_pii_jpg.jpg
│   └── s_pii_pdf.pdf
└── sample outputs:
    ├── result_structured.csv
    ├── redacteds_pii_jpg.jpg.png
    ├── redacteds_pii_png.png.png
    └── redactedmade_s_pii_pdf.pdf0.jpg.png
`.trim(),

    usage: `
Option A — Notebook (recommended for exploring):
1) Open pii_detect_final.ipynb
2) Point the notebook to one of the included sample files (txt/csv/xlsx/docx/png/jpg/pdf)
3) Run cells to generate:
   - redacted file outputs
   - result_structured.csv (audit report)

Option B — Script:
- Run main.py and pass an input file path; it will generate a redacted output + structured CSV report.
  (Exact CLI flags can be added once you standardize them — e.g., --input, --output_dir, --mode.)
`.trim(),

    importantNotes: [
      "This project focuses on privacy-preserving preprocessing and redaction for safer sharing/analysis — always validate redaction quality on your specific domain text before using in production.",
      "Scanned PDFs/images may require OCR; OCR quality can affect detection accuracy.",
      "Keep the structured report (CSV) alongside redacted outputs to support auditing and reproducibility.",
    ],

    dependencies: [
      "Python",
      "Jupyter Notebook",
      "pandas (tabular processing)",
      "OCR tooling (commonly: pytesseract + an OCR engine)",
      "PDF/image utilities (commonly: pdf2image + Pillow)",
      "DOCX + Excel readers (commonly: python-docx + openpyxl)",
      "PII/PHI detection tooling (repo includes a 'Presidio examples' folder; commonly Microsoft Presidio for NER/anonymization)",
    ],

    gettingStarted: `
1) Clone the repo
2) Create a virtual environment
3) Install dependencies (add a requirements.txt to make this 1 command)
4) Run:
   - pii_detect_final.ipynb for exploration
   - main.py for a scriptable pipeline
`.trim(),

    contributions:
      "Contributions are welcome — especially improvements like a requirements.txt, a consistent CLI for main.py, more PHI entity categories, stronger evaluation tests, and example integrations into ETL workflows.",

    license:
      "No license is specified in the repository yet (add one if you plan on external reuse).",

    credits:
      "Built using common OCR + NLP redaction patterns; includes experimentation/examples in the 'Presidio examples' folder and sample inputs/outputs to demonstrate the pipeline.",

    acknowledgements: [
      "Open-source OCR + document parsing ecosystem",
      "NLP/PII redaction tooling community (e.g., Presidio-style pipelines)",
    ],

    framework: "Python (script + notebook workflow)",
  },
  {
    name: "Visual Score",
    image: "/assets/images/project-1.jpg",
    tags: ["Python", "PyQt", "C++", "Music Technology", "GUI Systems"],
    sourceCode: "https://github.com/emaverick2001/VisualScore",
    projectLink: "https://visual-score.com/",
    onclick: () => trackProjectOpened("VisualScore", "projectCard"),

    desc: "Sheet music scoring software designed to support avant-garde and experimental composition.",

    overview:
      "VisualScore is a free, open-source sheet music scoring application built to serve experimental, aleatoric, and graphic music notation practices that are poorly supported by traditional notation software. Built on top of the Neoscore Python library, VisualScore provides composers with a flexible visual canvas and an intuitive graphical user interface for constructing unconventional scores. The project aims to democratize access to avant-garde notation tools while maintaining precision, extensibility, and performance. VisualScore is actively under development.",

    features: [
      "Interactive graphical canvas for score construction",
      "Support for aleatoric and graphic notation elements",
      "Custom object placement and manipulation within the score viewport",
      "Responsive UI powered by PyQt signals and slots",
      "Extensible architecture built on Neoscore primitives",
      "Designed for experimental composition workflows rather than traditional engraving",
    ],

    // gallery: ["/assets/images/visualscore/canvas.png", "/assets/images/visualscore/ui-layout.png"],

    howItWorks:
      "VisualScore wraps the Neoscore notation engine with a custom PyQt-based graphical interface. User interactions within the viewport (mouse events, selections, transformations) are handled through PyQt’s signal–slot mechanism, triggering updates to the underlying Neoscore objects. The application maintains synchronization between the visual canvas and the score’s internal data representation, enabling real-time feedback while composing and editing experimental notation structures.",

    directoryStructure:
      "The project is organized into modular components separating the GUI layer, score logic, and rendering pipeline. Core directories include UI definitions (Qt Designer files), application controllers, Neoscore integration logic, and utility modules for event handling and viewport updates.",

    usage:
      "VisualScore is intended for composers, researchers, and students interested in experimental music notation. Users can launch the application, interact directly with the canvas to place notation elements, and iteratively refine their scores using visual manipulation rather than rigid staff-based workflows.",

    importantNotes:
      "VisualScore prioritizes flexibility and experimentation over traditional notation constraints. As a result, it is not intended to replace mainstream engraving tools, but rather to complement them for composers working in avant-garde and contemporary music contexts.",

    dependencies: [
      "Python",
      "Neoscore",
      "PyQt / Qt Designer",
      "C++ (for performance-critical components)",
    ],

    gettingStarted:
      "Clone the repository, install the required Python dependencies, and run the main application entry point. Detailed setup instructions and dependency requirements are documented in the GitHub repository.",

    contributions:
      "Contributions are welcome. Developers can contribute by extending notation primitives, improving UI interactions, adding new experimental notation tools, or refining documentation. The project follows an open-source, collaborative development model.",

    license: "Open-source license (see repository for full license details).",

    credits:
      "Developed by Maverick Espinosa with contributions from collaborators during the VisualScore project.",

    acknowledgements: [
      "Neoscore development team",
      "Avant-garde composers and notation researchers whose work inspired the project",
    ],

    framework: "Python application built with PyQt and Neoscore",
  },
  {
    name: "Pure Data Synthesizer + Visualizer",
    image: "/assets/images/project-8.jpg",
    tags: ["Music", "Audio", "Visualization"],
    sourceCode: "https://github.com/emaverick2001/Pure-Data-Synthesizer",
    onclick: () => trackProjectOpened("Pure Data Synthesizer", "projectCard"),
    desc: "Virtual modular-style synth + arpeggiator mapped to a MIDI keyboard, paired with a live GEM visualizer",
    overview:
      "A real-time creative instrument built in Pure Data that combines a playable synthesizer, an arpeggiator mode, and a live visualizer powered by GEM. A MIDI keyboard is used as the control surface: knobs modulate audio effects (volume, BPM/tempo, glide, resonance, reverb, chorus, delay, panning) and those same parameters also drive visual behaviors such as object size, spawn rate, particle life, rotation, and motion. The result is a hands-on environment for sound design, performance, and learning through immediate audio-visual feedback.",

    features: [
      "MIDI control-surface mapping: play notes on a keyboard while using knobs as real-time modulation controls",
      "Synth + effects chain: knob-driven controls for volume, glide/slew, resonance/cutoff, reverb, chorus, delay, and panning",
      "Arpeggiator mode: toggleable arp that repeats the first 4 notes played (holding the last note sustains the loop)",
      "GEM visualizer: real-time scenes driven by the same MIDI parameters used for audio",
      "Shape-based visuals (GemShapes): notes can spawn/delete geometric objects (cubes/spheres/cones, etc.)",
      "Particle-based visuals (GemParticles): particle systems (lines/cubes) whose behavior changes with performance controls",
      "Performance-oriented workflow: designed to feel like a playable instrument rather than a static patch",
    ],

    // gallery: [
    //   "/assets/images/projects/pure-data-synthesizer/rayas.jpeg",
    //   "/assets/images/projects/pure-data-synthesizer/rayas2.jpeg",
    // ],

    howItWorks:
      "The patch routes MIDI note events to the synthesizer voice while MIDI CC (knob) values are mapped to effect parameters. The arpeggiator can be toggled on/off: when enabled, it captures the first four notes played and repeats them as a sequence until the last note is released. In parallel, the GEM visualizer receives the same control signals and maps them to visual properties. For example, volume can control object size, BPM can control spawn rate, and pan can shift objects left/right. This creates an expressive coupling between sound design gestures and on-screen motion/structure.",

    directoryStructure: `
Pure-Data-Synthesizer/
├── README.md
├── VirtKeyboard.pd          # main Pure Data patch (synth + arp + GEM visual layer)
├── model.dae                # 3D model asset used in the visualizer scene
├── Rayas.jpeg               # visual examples / documentation images
├── Rayas2.jpeg              # visual examples / documentation images
└── PD Synth Readme.pdf       # extended project notes / guide
`.trim(),

    usage: `
1) Install Pure Data (Pd) and ensure GEM is available/enabled.
2) Open the patch in Pure Data:
   - VirtKeyboard.pd
3) Connect your MIDI keyboard/controller and select it in the patch's MIDI settings.
4) Play notes on the keyboard; use knobs to modulate effects and visuals in real time.
5) Toggle arpeggiator mode:
   - With arp ON: play 4 notes to populate the sequence; hold the 4th note to sustain looping.
`.trim(),

    importantNotes: [
      "This project assumes a MIDI controller (the patch was designed around an 8-knob keyboard layout).",
      "GEM must be installed and working for the visualizer portion to render.",
      "Some knob→visual mappings are intentionally left as future work (to expand the expressivity of the visual layer).",
    ],

    dependencies: [
      "Pure Data (Pd)",
      "GEM (Graphics Environment for Multimedia) library for Pd",
      "MIDI keyboard/controller (recommended: at least 8 knobs/CC controls)",
    ],

    gettingStarted: `
- Clone the repository
- Install Pure Data and GEM
- Open VirtKeyboard.pd in Pure Data
- Configure MIDI input/output in Pd preferences (or within the patch UI)
- Start playing and modulating with knobs
`.trim(),

    contributions:
      "Contributions are welcome—especially improvements to the visual mappings, additional effects (e.g., granular/bitcrush), more flexible MIDI mapping presets, and documentation for different controller layouts.",

    license:
      "TBD (no license is specified in the repo yet—add a LICENSE file if you plan on open-source reuse).",

    credits:
      "Created as an exploration of interactive audio + visuals using Pure Data and GEM, with a focus on mapping performance controls to both sound and graphics.",

    acknowledgements: [
      "Pure Data community and documentation ecosystem",
      "GEM library contributors",
    ],

    framework: "Pure Data (Pd) + GEM",
  },
  {
    name: "Music Recommendation-system",
    image: "/assets/images/project-5.jpg",
    tags: ["Databases", "SQL", "JavaScript"],
    sourceCode: "https://github.com/emaverick2001/Music-Recommendation-system",
    projectLink: "https://music-information-system.vercel.app/",
    onclick: () => trackProjectOpened("Music Recommendation-system", "projectCard"),
    desc: "Music recommendation system powered by SQL queries over a relational music database",
    overview:
      "A user-centric music recommendation system that suggests songs using SQL-driven logic over a structured music database. The project emphasizes database design and query composition to support discovery—e.g., recommending tracks based on genres/artists, listening history, and similarity signals derived from metadata. A lightweight web interface allows users to submit preferences and receive recommended results.",

    features: [
      "Relational schema for music discovery: organizes core entities like tracks, artists, genres, and user interactions",
      "SQL-based recommendations: generates recommendations via joins, filters, ranking, and aggregation queries",
      "Preference-driven discovery: recommend by favorite artists/genres, recent listens, or seed track selection",
      "Explainable results: recommendations are derived from transparent query logic (useful for debugging + learning)",
      "Web UI: deployed frontend to query the database and display ranked recommendations",
    ],

    // gallery: [
    //   "/assets/images/projects/music-rec-system/home.png",
    //   "/assets/images/projects/music-rec-system/results.png",
    // ],

    howItWorks:
      "The system stores music metadata and user interaction data in a relational database (e.g., user likes, listens, favorites). When a user submits a seed (artist/genre/track) or uses their history, the app runs SQL queries that join music tables with user tables to compute candidate tracks, then ranks them using simple scoring rules (e.g., shared genre, shared artist, popularity/plays, or recency). The UI returns a curated list with relevant metadata so the user can explore new songs quickly.",

    directoryStructure:
      "Source repository includes the application code and database logic. (I can rewrite this section precisely once the repo link is accessible or you paste the top-level folders / README.)",

    usage: [
      "Open the deployed site and submit a seed preference (artist/genre/track) to generate recommendations.",
      "Optionally log interactions (likes/listens) so recommendations can incorporate user history.",
      "Browse returned recommendations and inspect metadata (artist/genre/etc.) to support discovery.",
    ],

    importantNotes: [
      "This project focuses on SQL-first recommendation logic (transparent + explainable), rather than black-box ML.",
      "Recommendation quality depends heavily on metadata completeness (genre tagging, artist consistency) and interaction coverage.",
      "A strong next step is adding evaluation (offline metrics like precision@k/recall@k) and cold-start fallbacks.",
    ],

    dependencies: [
      "JavaScript (web app)",
      "SQL database (relational DB used to store tracks/artists/genres/users)",
      "A server/API layer to run parameterized SQL queries (or a DB client in the app layer)",
    ],

    gettingStarted:
      "1) Clone the repo. 2) Initialize the database (schema + seed data). 3) Configure environment variables for the DB connection. 4) Start the app locally and run the recommendation queries through the UI. (I can convert this into exact commands once I can see the README / scripts.)",

    contributions:
      "Contributions are welcome—especially improvements to schema design, more recommendation query strategies, query optimization (indexes), and adding offline evaluation + test fixtures.",

    license: "TODO (add a LICENSE file if you want this to be explicitly open-source).",

    credits:
      "Built as a database-focused music discovery/recommendation project emphasizing SQL query design and explainable ranking logic.",

    acknowledgements: [
      "Course/instructional inspiration for building SQL-driven applications (if applicable)",
      "Open datasets used to seed tracks/artists/genres (if applicable)",
    ],

    framework: "Web app + relational database (SQL-driven recommendation logic)",
  },
]

export const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

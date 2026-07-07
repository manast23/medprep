# MedPrep — Project Document (Live, Repo-Tracked)
*This file lives in the repo at `PROJECT_DOC.md` and is the single source of truth for the project. Claude updates it directly after every significant change — new content, format corrections, roadmap shifts. Do not maintain a separate local copy; always pull the current version from the repo at the start of a session.*

*Last updated: July 2026*

---

## 1. What is MedPrep?

MedPrep is a medical MCQ practice web app for medical students. It tests **basic factual and conceptual knowledge the way a real university subject exam does** — not clinical reasoning, not licensing-exam-style integrated vignettes.

**Origin story (why this matters):** The founder is a medical graduate who, as a student, found that existing practice resources were already too clinical-vignette-heavy — full staged patient cases when what he actually wanted was a tool for plain factual recall practice ahead of college papers. MedPrep exists to fill that specific gap: a clean, subject-wise question bank that mirrors what a real 1st/2nd-year university exam paper looks like, with textbook-referenced explanations.

**Live app:** https://medprep-three.vercel.app
**Repo:** `manast23/medprep` (private, GitHub)

---

## 2. Positioning

General medical knowledge practice app — not tied to any specific exam, country, or university. Nothing inside the app mentions a specific exam or audience. Exam-specific targeting (NRE, PMDC, foreign graduates) is reserved for social media marketing only.

**NRE 2023 syllabus and First Aid are reference tools for TOPIC SELECTION ONLY** (what subtopics to cover) — never for question format or difficulty. This distinction was a major correction made in July 2026 (see Section 6).

---

## 3. Tech Stack & Design System

| Layer | Tool |
|---|---|
| Framework | Next.js |
| Hosting | Vercel (auto-deploy on push to main) |
| Repo | GitHub — `manast23/medprep` (private) |
| Styling | CSS Modules |
| Content | `data/questions.json` |
| Database | None yet — JSON file only |
| Auth | None yet |

**Aesthetic:** Clean, minimal, professional. Light background (`#f5f3ef`), white cards, teal/green accent.

| Token | Value |
|---|---|
| Primary green | `#0f6e56` |
| Green mid | `#1d9e75` |
| Green light | `#e1f5ee` |
| Background | `#f5f3ef` |
| Text | `#1a1a1a` |
| Text muted | `#6b6b6b` |
| Border | `#e2ddd8` |
| Correct | `#1d9e75` on `#e1f5ee` |
| Incorrect | `#e24b4a` on `#fcebeb` |
| Border radius | `12px` |

**Pages:** Home (`/`, subject selection + settings sidebar) → Quiz (`/quiz`, question + options + progress bar + explanation panel) → Results (`/results`, score + topic breakdown).

**Subject card images:** `public/[subject].jpg`, 429×240px. Must be built before writing questions for any new subject.

---

## 4. Question Schema

```json
{
  "id": 617,
  "subject": "Community Medicine",
  "subtopic": "Epidemiology",
  "type": "factual",
  "question": "...",
  "options": ["A", "B", "C", "D", "E"],
  "correct": 2,
  "explanation": "Sentence 1. Sentence 2. Sentence 3.",
  "reference": "Book title, edition — Chapter",
  "reference_url": "https://..."
}
```

**Field rules:**
- `id` — sequential integer, never reused
- `type` — `factual` or `clinical`. **`clinical` is only valid for Anatomy, Physiology, and Biochemistry.** Pathology, Pharmacology, and Microbiology use `factual` exclusively (see Section 6).
- `correct` — zero-indexed (0=A ... 4=E)
- `reference` — book + edition + chapter only, no page numbers
- `reference_url` — StatPearls, NCBI Bookshelf, MSD Manual, or Radiopaedia only. Every URL must be verified live (HTTP fetch or explicit search confirmation) before inclusion — do not guess NBK IDs.

---

## 6. Question Writing Standard (CORRECTED July 2026 — READ THIS BEFORE WRITING ANY QUESTION)

**This supersedes all prior guidance.** The original question-writing rule ("Always use a clinical scenario, never a bare fact," with a full staged patient case as the template) was wrong and produced ~394 over-staged questions across the bank that read like licensing/board-exam vignettes (USMLE/NRE-style) rather than university subject papers. That rule is retired.

**The actual standard, by subject group:**

### Pre-clinical, foundational subjects: Anatomy, Physiology, Biochemistry
Overwhelmingly direct factual/mechanism/identification questions. A "clinical" question here should be at most a **brief one-line trigger** (e.g. "infant with musty urine odor" for PKU, "wrist drop after humeral fracture" for radial nerve) — never a staged case with age/sex/vitals/labs/multi-step reasoning. `type: "clinical"` is retained for these subjects for that narrow use.

### Para-clinical, basic medical science subjects: Pathology, Pharmacology, Microbiology
**Policy correction (July 2026):** These three subjects are internationally classified as basic/para-clinical medical sciences, taught and examined *before* students begin clinical rotations. Real university papers for these subjects (verified against actual PMDC/NUMS-aligned MBBS pharmacology and pathology MCQ banks) do not stage patient encounters at all — they ask the disease/drug/organism fact directly:
- "Kernicterus is an adverse effect of which drug class?"
- "Which organism most commonly causes bacterial pharyngitis (sore throat)?"
- "Stevens-Johnson syndrome is an associated adverse effect of which drug class?"
- "Which topoisomerase do fluoroquinolones inhibit in Gram-negative bacteria?"

**`type: "clinical"` is retired entirely for Pathology, Pharmacology, and Microbiology. Every question in these three subjects is `type: "factual"`.** No patient is invoked at all — no age, no sex, no "presents with," no symptom timeline, no vitals, no lab panel dressed up as a case. The disease/drug/organism correlate itself (which is the actual exam-relevant fact — e.g. which organism causes X, which drug causes Y, which drug treats Z) is asked directly as a fact, not narrated through a fictional patient. This is a stricter standard than the original July 2026 correction applied to these subjects (which still allowed a "short clinical stem, one detail") — the further correction is: even that one-detail stem should usually be dropped in favor of a direct fact statement, unless the fact genuinely cannot be phrased without a causal trigger (e.g. an interaction that only manifests in a specific context).

### General rules (all subjects)
- **No cross-subject dressing.** Don't borrow content from another subject to add clinical flavor (e.g. no CML/Philadelphia chromosome in a Biochemistry question — that's Hematopathology).
- **No content duplication** — check nearby questions in the same subtopic before finalizing a batch; don't test the identical fact twice under different wrapping.
- Target average stem length: roughly 10–20 words for para-clinical subjects (direct fact statements are naturally short), 15–25 words for pre-clinical subjects with a one-line trigger. Anything pushing 30+ words with embedded vitals/labs is a signal it's drifted toward board-exam style.

**Explanation format (unchanged):** exactly 3 sentences — (1) why the correct answer is right, (2) a reinforcing mechanism/detail, (3) why the main distractor is wrong.

---

## 7. Current Question Bank State (verified live, July 2026)

**Total: 670 questions across 6 complete subjects, plus Community Medicine in progress.**

| Subject | Count | Status |
|---|---|---|
| Anatomy | 105 | ✅ Retroactive rewrite COMPLETE (105/105) — see Section 8 |
| Physiology | 111 | ✅ Retroactive rewrite COMPLETE (111/111) + subtopic naming cleanup done — see Section 8 |
| Pathology | 100 | ✅ Para-clinical rewrite COMPLETE (100/100, all `factual`) — see Section 8 |
| Pharmacology | 100 | ✅ Para-clinical rewrite COMPLETE (100/100, all `factual`) — see Section 8 |
| Microbiology | 100 | ✅ Para-clinical rewrite COMPLETE (100/100, all `factual`) — Phase 1 + Phase 2 done, see Section 8 |
| Biochemistry | 100 | ✅ Complete — fully rewritten to corrected standard (IDs 517–616) |
| Community Medicine | 54 / ~80 | 🔄 IN PROGRESS — subject card done, Biostatistics (10) + Epidemiology & Research Methods (12) + Demography & Population Health (10) + Communicable Disease Epidemiology & Control (12) + Non-Communicable Disease & Public Health (10) complete — see Section 8 |

**Subtopic breakdown (Biochemistry, most recently completed, fully corrected):**
Proteins & Enzymes (14), Lipids & Fatty Acids (11), Porphyrins & Haemoglobin (10), Vitamins/Minerals/Nutrition (12), Carbohydrate Metabolism (14), Lipid Metabolism (10), Protein & Amino Acid Metabolism (12), Biochemical Genetics & Molecular Biology (10), Endocrine & Fluid Biochemistry (7).

---

## 8. ACTIVE TASK: Retroactive Format Rewrite

**Why:** ~394 clinical-type questions across the bank (built under the old "always clinical scenario" rule) are staged like licensing-exam vignettes rather than university-paper questions. Fixing retroactively, worst-offender-first.

**Order:** Microbiology → Anatomy → Physiology → Pharmacology → Pathology

### Microbiology (100 total) — ✅ COMPLETE (Phase 1 + Phase 2)
| Subtopic | IDs | Status |
|---|---|---|
| General Microbiology & Bacteriology | 417–436 | ✅ Rewritten (Phase 1, old standard); Phase 2 reclassified 6 already-direct organism-fact questions as `factual` |
| Gram-positive Bacteria | 437–451 | ✅ Rewritten (Phase 1; fixed #444 miscategorization — was testing a viral cause of croup under a bacteria subtopic); Phase 2 reclassified 3 |
| Gram-negative Bacteria | 452–466 | ✅ Rewritten (Phase 1; fixed #457 — was duplicate of cholera toxin mechanism already tested in #434; replaced with chancroid/H. ducreyi); Phase 2 reclassified 4 |
| Mycobacteria & Atypical Organisms | 467–476 | ✅ Rewritten (Phase 1); Phase 2 reclassified 1 |
| Virology | 477–496 | ✅ Rewritten (Phase 1); Phase 2 reclassified 5 |
| Mycology & Parasitology | 497–506 | ✅ Rewritten (Phase 1); Phase 2 reclassified all 10 |
| Immunology | 507–516 | ✅ Rewritten (Phase 1); Phase 2 reclassified 8 |

**Microbiology progress: 100/100 rewritten, 100/100 `factual`. Phase 2 confirmed the Phase 1 "brief clinical trigger" stems were already impersonal, direct organism-fact statements (lab/microscopy findings or disease-category descriptions, no invented patient with age/timeline) — so Phase 2 was a `type` reclassification pass rather than a rewording pass. Subject fully complete under the new standard.**

**This closes out the full para-clinical policy correction: Pathology, Pharmacology, and Microbiology are all 100% `factual`, zero `clinical`-type questions remain in any para-clinical subject.**

### Community Medicine (~80 total planned) — 🔄 IN PROGRESS
New subject. Subject card image complete (see Section 9). Question writing follows the NRE 2023 syllabus (pages 21–23) for topic/subtopic selection, but content is kept universally applicable — Pakistan-specific health-system material (Section 1 of the syllabus: "Health Systems in Pakistan," district health system, national programs) is deliberately excluded from questions, per the product positioning rule (no exam-specific/geography-specific language inside the app). Generalizable epidemiology, biostatistics, demography, and public-health content from the syllabus is used instead. All questions are `factual`, direct fact statements — no invented patient — consistent with the para-clinical standard, since genuine scenario-based reasoning (e.g. outbreak investigation) hasn't been needed so far.

References use Park's Textbook of Preventive and Social Medicine (book) plus verified NCBI Bookshelf/PMC URLs per question (StatPearls articles and NCBI Bookshelf chapters, matching the allowed `reference_url` source list).

| Subtopic | IDs | Status |
|---|---|---|
| Biostatistics | 617–626 | ✅ Complete (10) — central tendency, dispersion, hypothesis testing (p-values, Type I/II error), sampling methods, correlation |
| Epidemiology & Research Methods | 627–638 | ✅ Complete (12) — cohort/case-control/cross-sectional study designs, incidence/prevalence, relative risk/odds ratio, sensitivity/specificity/PPV, confounding/recall/lead-time bias, attack rate |
| Demography & Population Health | 639–648 | ✅ Complete (10) — demographic transition stages, health indicators (IMR/MMR/neonatal mortality), fertility measures, population pyramids, dependency ratio |
| Communicable Disease Epidemiology & Control | 649–660 | ✅ Complete (12) — chain of infection, R0/herd immunity threshold, quarantine vs isolation, DOTS strategy, disease notification/surveillance, vector control, immunization principles (live vs inactivated, cold chain, active vs passive) |
| Non-Communicable Disease & Public Health | 661–670 | ✅ Complete (10) — HTN (public health importance, dietary sodium risk), levels of prevention (primordial/primary/secondary), T2DM global burden, CAD modifiable risk factors + primary/secondary prevention, asthma prevalence trends, iron-deficiency anaemia burden, thalassemia premarital/preconception screening |
| Health Planning & Primary Health Care | — | ⏳ Next — generalized PHC principles, health system organization concepts (Alma Ata declaration etc.) |
| Nutrition & Reproductive Health | — | ⏳ Pending — nutritional deficiency, growth/nutrition indicators, maternal/reproductive health indicators |
| Disaster Management & Environmental Health | — | ⏳ Pending — disaster classification/preparedness, environmental and occupational health |

**Community Medicine progress: 54/~80 written.**

### Pharmacology (100 total) — ✅ COMPLETE under new para-clinical standard
All 9 subtopics rewritten: `type: "clinical"` retired entirely, every question converted to a direct drug-fact statement (mechanism, adverse effect, indication, or interaction) with no patient framing — no age, no "presents with," no vitals/labs.

| Subtopic | IDs | Status |
|---|---|---|
| General Pharmacology | 317–331 | ✅ Rewritten (4 patient-framed stems converted) |
| Autonomic Pharmacology | 332–346 | ✅ Rewritten (4 patient-framed stems converted) |
| CNS Pharmacology | 347–361 | ✅ Rewritten (all 15 were heavily staged multi-sentence vignettes — converted to direct drug-fact statements) |
| Antimicrobials | 382–396 | ✅ Rewritten (all 15 converted) |
| Cardiovascular Pharmacology | 362–373 | ✅ Rewritten (all 12 converted) |
| Endocrine Pharmacology | 397–406 | ✅ Rewritten (all 10 converted) |
| Renal & Diuretics | 374–381 | ✅ Rewritten (all 8 converted) |
| GIT Pharmacology | 407–411 | ✅ Rewritten (all 5 converted) |
| Chemotherapy & Immunosuppressants | 412–416 | ✅ Rewritten (all 5 converted) |

**Pharmacology progress: 100/100 rewritten, 100/100 `factual`. Subject fully complete under the new standard.**

### Pathology (100 total) — ✅ COMPLETE under new para-clinical standard
All 10 subtopics rewritten: `type: "clinical"` retired entirely, every question converted to a direct disease-fact statement with no patient framing.

| Subtopic | IDs | Status |
|---|---|---|
| General Pathology | 217–236 | ✅ Rewritten (6 patient-framed stems converted) |
| Cardiovascular Pathology | 237–248 | ✅ Rewritten (5 converted) |
| Haematopathology | 249–260 | ✅ Rewritten (4 converted) |
| GIT & Liver Pathology | 271–282 | ✅ Rewritten (4 converted) |
| Respiratory Pathology | 261–270 | ✅ Rewritten (3 converted) |
| Renal Pathology | 283–292 | ✅ Rewritten (3 converted) |
| Female Genital & Breast Pathology | 293–300 | ✅ Rewritten (2 converted) |
| Endocrine Pathology | 301–308 | ✅ Rewritten (2 converted) |
| Musculoskeletal & Skin Pathology | 309–313 | ✅ Rewritten (1 converted) |
| Chemical Pathology | 314–316 | ✅ Rewritten (1 converted) |

**Pathology progress: 100/100 rewritten, 100/100 `factual`. Subject fully complete under the new standard.**

### Microbiology — PHASE 2 (100 total) — NOT STARTED (ACTIVE NEXT)
Already rewritten once (100/100) under the OLD "brief clinical trigger" standard. Needs a second pass to retire `type: "clinical"` entirely per the July 2026 para-clinical policy correction — convert remaining patient-framed organism stems (e.g. "a patient with X develops Y — which organism?") to direct organism-fact statements (e.g. "Which organism most commonly causes sore throat/pharyngitis?").

### Anatomy (105 total) — ✅ COMPLETE
Rewritten across all 7 subtopics. Approach: pre-clinical subject standard applied throughout — trimmed multi-finding/vitals staging down to essential trigger, removed fake "student is asked" framing on pure factual questions (reclassified as `factual` where appropriate), and fixed one content duplication (ID 1 repointed from Erb's palsy, which duplicated ID 17, to Klumpke's palsy).

| Subtopic | IDs | Status |
|---|---|---|
| Upper Limb | 1–25 | ✅ Rewritten (ID1: trimmed RTA/ED staging, repointed Erb's→Klumpke's palsy to fix duplication with ID17) |
| Lower Limb | 3, 5, 26–38 | ✅ Rewritten (ID3: removed fake "student is asked" framing, reclassified factual) |
| Thorax | 4, 39–51 | ✅ Rewritten (trimmed vitals/multi-finding staging on IDs 4, 39, 41, 43, 45, 51) |
| Abdomen & Pelvis | 52–66 | ✅ Rewritten (trimmed irrelevant vignette staging on IDs 52, 54, 58; reclassified 56, 60 as factual — vignette added nothing to the actual landmark fact tested; trimmed 66) |
| Head & Neck | 67–81 | ✅ Reviewed — already conformed to standard, no changes needed |
| Neuroanatomy & Embryology | 82–95 | ✅ Rewritten (ID84: trimmed risk-factor preamble on Wallenberg syndrome question) |
| Histology | 96–110 | ✅ Rewritten (trimmed unnecessary age/gender preambles on IDs 99, 102, 104, 106, 108, 110) |

**Anatomy progress: 105/105 rewritten. Subject fully complete.**

### Physiology (111 total) — ✅ COMPLETE
Rewritten across all 10 subtopics, plus subtopic-naming cleanup (3 stray labels reassigned to the official taxonomy). Approach: pre-clinical subject standard applied — trimmed multi-finding/lab-panel staging down to essential mechanism triggers, dropped unused numeric baggage that didn't inform the answer, and fixed two content duplications (ID8 vs ID154 on COPD/hypoxic drive; ID158 vs ID179 on diabetes insipidus).

| Subtopic | IDs | Status |
|---|---|---|
| Cardiovascular | 6, 111–126 | ✅ Rewritten (trimmed unused numeric baggage on IDs 6, 113; reclassified ID118 as factual — pure MAP calculation) |
| Nervous System | 10, 127–141 | ✅ Rewritten (ID10 reassigned from stray "Neurophysiology" label) |
| Respiratory | 8, 142–154 | ✅ Rewritten (fixed ID8/ID154 duplication — repointed ID8 to ABG compensation interpretation; trimmed age/gender across subtopic) |
| Endocrinology | 9, 167–179 | ✅ Rewritten (ID9 reassigned from stray "Endocrine" label; trimmed over-staged symptom lists to essential mechanism triggers on 167,169,171,173,175,177,179) |
| Renal & Body Fluids | 7, 155–166 | ✅ Rewritten (ID7 reassigned from stray "Renal" label; fixed ID158/ID179 duplication — repointed ID158 to nephrogenic DI; removed a confusing distractor clause on ID160) |
| GIT | 180–190 | ✅ Reviewed — already conformed to standard, no changes needed |
| Blood | 191–198 | ✅ Rewritten (trimmed age/gender preambles) |
| Nerve & Muscle | 199–205 | ✅ Rewritten (trimmed age/gender preambles and minor redundant detail) |
| Special Senses | 206–211 | ✅ Rewritten (trimmed age/gender preambles) |
| Reproduction | 212–216 | ✅ Rewritten (trimmed age/gender preambles) |

**Physiology progress: 111/111 rewritten. Subject fully complete.**

---

## 9. After the Retroactive Rewrite

1. ✅ Microbiology rewrite — COMPLETE (100/100, Phase 1 + Phase 2, all `factual`)
2. ✅ Anatomy rewrite — COMPLETE (105/105)
3. ✅ Physiology rewrite (+ subtopic naming cleanup) — COMPLETE (111/111)
4. ✅ Pharmacology — full rewrite under new para-clinical standard — COMPLETE (100/100 factual)
5. ✅ Pathology — full rewrite under new para-clinical standard — COMPLETE (100/100 factual)

**The full retroactive rewrite is now DONE across all 6 existing subjects (616/616 questions).**

6. **Community Medicine — ACTIVE, IN PROGRESS** — subject card ✅ done; 54/~80 questions written (Biostatistics, Epidemiology & Research Methods, Demography & Population Health, Communicable Disease Epidemiology & Control, Non-Communicable Disease & Public Health complete). Next up: Health Planning & Primary Health Care. See Section 8 for subtopic-by-subtopic progress and the remaining plan.
7. **Forensic Medicine** — deferred 8th subject

---

## 9a. QA Policy (added July 2026)

**Cadence:** A dedicated QA pass runs every 30–40 newly written questions (roughly once per subject-third), separate from the inline checks Claude does while drafting each batch. This applies to new question writing going forward (Community Medicine onward); it is not being retroactively run over the already-completed Anatomy/Physiology/Pathology/Pharmacology/Microbiology/Biochemistry rewrites unless specifically requested.

**What the QA pass checks:**
1. **Duplicate content within subtopic/subject** — re-scan all questions in the subject written so far for near-identical facts tested under different wording.
2. **Reference URL still valid & relevant** — re-verify (via search, not just curl, since NCBI Bookshelf 403s automated fetches) that each `reference_url` resolves and actually supports the question's content.
3. **Medical accuracy spot-check against source** — for a sample of questions, confirm the stated fact/mechanism against the cited source or general medical knowledge, flagging anything questionable.
4. **Format compliance** — word count, exactly-3-sentence explanations, no patient framing in para-clinical subjects, correct answer index actually matches the explanation.

**Not currently in scope** (can be added if requested): cross-subject duplicate checking (e.g. confirming a Community Medicine fact doesn't already exist verbatim in Microbiology).

**Process:** Claude runs the QA pass itself (re-reading the relevant slice of `questions.json`, re-searching references, reasoning through accuracy) and reports findings before continuing to new question writing. Any fixes found are pushed as their own commit, separate from new-content commits.

### QA Pass #1 (Community Medicine, first 44 questions — IDs 617–660)
- **Duplication:** No true duplicates found. One borderline pair (ID 649 chain-of-infection framework vs ID 659 respiratory portal-of-exit application) judged complementary rather than duplicate — different pedagogical angle on the same underlying concept.
- **Reference URLs:** 2 issues found and fixed — (1) ID 655 had a malformed URL (`/sites/books/` instead of `/books/`); (2) IDs 639, 640, 644, 645, 646 all cited a real but overly narrow paper ("Population Momentum Across the Demographic Transition," PMC3345894) for basic demographic-transition/population-pyramid definitions it wasn't really about — replaced with a better general-fit NCBI Bookshelf source (NBK540845, "Global Health Transitions and Sustainable Solutions").
- **Medical accuracy spot-check:** Sampled Type I/II error, herd immunity threshold calculation (R0=4 → 75%), IMR/MMR definitions, live-vaccine contraindication mechanism, DOTS rationale — all confirmed correct.
- **Format compliance:** Programmatic check (3-sentence explanations, `factual` type only, no patient-framing phrases, reference_url present) — clean except ID 647 (census), which has no `reference_url` by deliberate choice (no suitably specific StatPearls/NCBI/MSD/Radiopaedia source found for this basic definitional fact; noted rather than force-fitting a loose citation).
- **Fixes pushed** in a dedicated QA commit, separate from content commits.

---

## 10. Workflow

**Session start:** Paste a fresh GitHub PAT (fine-grained, `manast23/medprep`, Contents: Read and write — generate fresh each session, they expire). Claude fetches this `PROJECT_DOC.md` directly from the repo for context — no need to paste a local copy.

**Push pattern (Python urllib):** GET `data/questions.json` for current SHA + content → parse → modify (append new / replace existing by ID) → re-encode base64 → PUT with fresh SHA (fetched immediately before each push, never reused) and commit message. For new files, omit SHA.

**Reference verification:** Every `reference_url` verified live via web search before inclusion — StatPearls/NCBI Bookshelf/MSD Manual/Radiopaedia only. NCBI Bookshelf URLs may return HTTP 403 to automated curl checks (bot-blocking) — this is not the same as an invalid URL; verify via search instead of relying solely on curl status.

**Question review:** For new content, questions are shown in chat for review before pushing when requested. Existing-content rewrites are shown in batches by subtopic, with the diff/rationale explained, before pushing.

**Quality assurance cadence (added July 2026):** After every 20 newly-written questions (roughly every 2 batches), pause new writing and run a dedicated QA pass before continuing:
1. **Duplication scan** — re-read each new question's core tested fact against nearby questions in the same subtopic, and spot-check against other subjects covering related content (e.g. Community Medicine vs Microbiology both touching malaria/TB).
2. **Independent re-derivation** — re-answer each question from scratch without referring to the stored `correct` index, then compare, to catch errors introduced during drafting.
3. **Reference check** — re-fetch each `reference_url` from the batch to confirm it still resolves and is genuinely on-topic, not just superficially related.
4. **Format compliance** — word count, `type` field correctness for the subject, exactly 3-sentence explanations, and correct-answer index distribution across the batch (not clustering on one option letter).

Any fixes found are pushed as a normal commit, and the QA pass itself (what was checked, what if anything was fixed) is noted in this document under the relevant subject's progress table.

**This document:** Updated and pushed to the repo immediately after any of: completing a subtopic/subject batch, a standard/policy correction, a roadmap change, or a QA pass. Treat it as living documentation, not a session summary.

---

## 11. Monetization Plan (Future, unchanged)

Phase 1 — Free launch. Phase 2 — Freemium (free tier limited/day, paid tier full bank + timed mode + progress tracking). Phase 3 — Scale (annual plan, subject packs, institutional access).

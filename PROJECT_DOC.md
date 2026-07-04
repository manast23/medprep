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
- `type` — `factual` or `clinical` (see Section 6 for what these actually mean)
- `correct` — zero-indexed (0=A ... 4=E)
- `reference` — book + edition + chapter only, no page numbers
- `reference_url` — StatPearls, NCBI Bookshelf, MSD Manual, or Radiopaedia only. Every URL must be verified live (HTTP fetch or explicit search confirmation) before inclusion — do not guess NBK IDs.

---

## 6. Question Writing Standard (CORRECTED July 2026 — READ THIS BEFORE WRITING ANY QUESTION)

**This supersedes all prior guidance.** The original question-writing rule ("Always use a clinical scenario, never a bare fact," with a full staged patient case as the template) was wrong and produced ~394 over-staged questions across the bank that read like licensing/board-exam vignettes (USMLE/NRE-style) rather than university subject papers. That rule is retired.

**The actual standard:**

- **Pre-clinical, foundational subjects (Anatomy, Physiology, Biochemistry):** Overwhelmingly direct factual/mechanism/identification questions. A "clinical" question here should be at most a **brief one-line trigger** (e.g. "infant with musty urine odor" for PKU, "wrist drop after humeral fracture" for radial nerve) — never a staged case with age/sex/vitals/labs/multi-step reasoning.
- **Disease/drug/organism-oriented subjects (Pathology, Pharmacology, Microbiology):** A short disease/drug/organism-based stem is more native to how real papers phrase these questions, but must stay concise — one clinical detail + the question. Not a full staged ED encounter.
- **No cross-subject dressing.** Don't borrow content from another subject to add clinical flavor (e.g. no CML/Philadelphia chromosome in a Biochemistry question — that's Hematopathology).
- **No content duplication** — check nearby questions in the same subtopic before finalizing a batch; don't test the identical fact twice under different wrapping (e.g. cholera toxin mechanism should only appear once across Microbiology).
- Target average stem length: roughly 15–25 words. Anything pushing 30+ words with embedded vitals/labs is a signal it's drifted toward board-exam style.

**Explanation format (unchanged):** exactly 3 sentences — (1) why the correct answer is right, (2) a reinforcing mechanism/detail, (3) why the main distractor is wrong.

---

## 7. Current Question Bank State (verified live, July 2026)

**Total: 616 questions across 6 complete subjects.**

| Subject | Count | Status |
|---|---|---|
| Anatomy | 105 | ✅ Retroactive rewrite COMPLETE (105/105) — see Section 8 |
| Physiology | 111 | ✅ Retroactive rewrite COMPLETE (111/111) + subtopic naming cleanup done — see Section 8 |
| Pathology | 100 | ✅ Complete — ⚠️ needs partial rewrite (least affected, ~31 clinical questions to review) |
| Pharmacology | 100 | ✅ Complete — ⚠️ needs partial rewrite (~78 clinical questions to review) (NEXT UP) |
| Microbiology | 100 | ✅ Retroactive rewrite COMPLETE (100/100) — see Section 8 |
| Biochemistry | 100 | ✅ Complete — fully rewritten to corrected standard (IDs 517–616) |

**Subtopic breakdown (Biochemistry, most recently completed, fully corrected):**
Proteins & Enzymes (14), Lipids & Fatty Acids (11), Porphyrins & Haemoglobin (10), Vitamins/Minerals/Nutrition (12), Carbohydrate Metabolism (14), Lipid Metabolism (10), Protein & Amino Acid Metabolism (12), Biochemical Genetics & Molecular Biology (10), Endocrine & Fluid Biochemistry (7).

---

## 8. ACTIVE TASK: Retroactive Format Rewrite

**Why:** ~394 clinical-type questions across the bank (built under the old "always clinical scenario" rule) are staged like licensing-exam vignettes rather than university-paper questions. Fixing retroactively, worst-offender-first.

**Order:** Microbiology → Anatomy → Physiology → Pharmacology → Pathology

### Microbiology (100 total) — ✅ COMPLETE
| Subtopic | IDs | Status |
|---|---|---|
| General Microbiology & Bacteriology | 417–436 | ✅ Rewritten |
| Gram-positive Bacteria | 437–451 | ✅ Rewritten (fixed #444 miscategorization — was testing a viral cause of croup under a bacteria subtopic) |
| Gram-negative Bacteria | 452–466 | ✅ Rewritten (fixed #457 — was duplicate of cholera toxin mechanism already tested in #434; replaced with chancroid/H. ducreyi) |
| Mycobacteria & Atypical Organisms | 467–476 | ✅ Rewritten |
| Virology | 477–496 | ✅ Rewritten |
| Mycology & Parasitology | 497–506 | ✅ Rewritten |
| Immunology | 507–516 | ✅ Rewritten |

**Microbiology progress: 100/100 rewritten. Subject fully complete.**

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

### Pharmacology (100 total) — NOT STARTED (ACTIVE NEXT)
78/100 currently clinical. Pharm vignettes are more defensible than Anatomy/Physiology (drug-effect-in-a-patient framing is native to the subject) but many are still overstaged; needs review and trimming rather than full rewrite.

### Pathology (100 total) — NOT STARTED
31/100 currently clinical — least affected subject, disease-based short stems are appropriate here. Needs lighter review pass to confirm none have drifted into full ED-style staging.

---

## 9. After the Retroactive Rewrite

1. ✅ Microbiology rewrite — COMPLETE (100/100)
2. ✅ Anatomy rewrite — COMPLETE (105/105)
3. ✅ Physiology rewrite (+ subtopic naming cleanup) — COMPLETE (111/111)
4. **Pharmacology review/trim — ACTIVE NEXT** (78/100 currently clinical)
5. Pathology review/trim
6. **Community Medicine** — new subject, build subject card image first, then write ~80 questions to the corrected standard from day one (Epidemiology, Biostatistics folded in)
7. **Forensic Medicine** — deferred 8th subject

---

## 10. Workflow

**Session start:** Paste a fresh GitHub PAT (fine-grained, `manast23/medprep`, Contents: Read and write — generate fresh each session, they expire). Claude fetches this `PROJECT_DOC.md` directly from the repo for context — no need to paste a local copy.

**Push pattern (Python urllib):** GET `data/questions.json` for current SHA + content → parse → modify (append new / replace existing by ID) → re-encode base64 → PUT with fresh SHA (fetched immediately before each push, never reused) and commit message. For new files, omit SHA.

**Reference verification:** Every `reference_url` verified live via web search before inclusion — StatPearls/NCBI Bookshelf/MSD Manual/Radiopaedia only. NCBI Bookshelf URLs may return HTTP 403 to automated curl checks (bot-blocking) — this is not the same as an invalid URL; verify via search instead of relying solely on curl status.

**Question review:** For new content, questions are shown in chat for review before pushing when requested. Existing-content rewrites are shown in batches by subtopic, with the diff/rationale explained, before pushing.

**This document:** Updated and pushed to the repo immediately after any of: completing a subtopic/subject batch, a standard/policy correction, a roadmap change. Treat it as living documentation, not a session summary.

---

## 11. Monetization Plan (Future, unchanged)

Phase 1 — Free launch. Phase 2 — Freemium (free tier limited/day, paid tier full bank + timed mode + progress tracking). Phase 3 — Scale (annual plan, subject packs, institutional access).

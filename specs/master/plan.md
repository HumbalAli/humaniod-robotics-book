# Implementation Plan: Physical AI & Humanoid Robotics Book

**Branch**: `master` | **Date**: 2025-12-04 | **Spec**: specs/master/spec.md
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a short, clean, professional AI-Native textbook based on the Physical AI & Humanoid Robotics course. The book must serve as a fast, simple, high-quality learning resource built with a modern Docusaurus UI and a fully integrated free-tier RAG chatbot.

Key Features:
- Docusaurus textbook
- RAG chatbot (Qdrant + Neon + FastAPI)
- Select-text → Ask AI
- Optional Urdu / Personalize features

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: **Frontend:** TypeScript (Node.js 18.x/20.x, Docusaurus v3). **Backend:** Python 3.9+ (FastAPI).
**Primary Dependencies**: Docusaurus AI/plugins/LangChain, Qdrant (vector DB), Neon (PostgreSQL + `pgvector`), FastAPI.
**Storage**: Qdrant (vector embeddings), Neon (PostgreSQL for metadata).
**Testing**: **Docusaurus:** Vale, local dev, CI/CD. **FastAPI RAG:** Pytest (unit/integration), Botium/TestMyBot (E2E), JMeter/Locust (performance), RAGAS/DeepEval (RAG-specific).
**Target Platform**: **Docusaurus:** GitHub Pages. **FastAPI RAG:** Leapcell (app hosting), Qdrant Cloud (vector DB), Neon (PostgreSQL).
**Project Type**: web
**Performance Goals**: **Docusaurus:** Sub-second page load. **FastAPI RAG:** Sub-100ms response.
**Constraints**: No heavy GPU usage, Minimal embeddings
**Scale/Scope**: Up to 50k MAU (free-tier services), content in S3/DynamoDB, modular for future expansion.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity**: Ensure minimal complexity in design and implementation.
- **Accuracy**: All technical information and RAG answers must be accurate and derived solely from book text.
- **Minimalism**: Adhere to a clean, focused design without unnecessary features.
- **Fast builds**: Optimize for quick build times.
- **Free-tier architecture**: Design should be compatible with free-tier services.
- **RAG answers ONLY from book text**: RAG chatbot must only use content from the textbook.
- **Constraints**: No heavy GPU usage, Minimal embeddings.
- **Success Criteria**: Build success, Accurate chatbot, Clean UI, Smooth GitHub Pages deployment.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] REMOVE IF UNUSED: Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] REMOVE IF UNUSED: Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] REMOVE IF UNUSED: Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: The project will be a web application using Docusaurus. The structure will be based on Docusaurus conventions.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

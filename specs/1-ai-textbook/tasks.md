# Tasks: textbook-generation

**Feature Branch**: `1-ai-textbook` | **Date**: 2025-12-04 | **Spec**: specs/1-ai-textbook/spec.md | **Plan**: specs/1-ai-textbook/plan.md
**Input**: Feature specification from `specs/1-ai-textbook/spec.md`, Implementation plan from `specs/1-ai-textbook/plan.md`

## Overview
This document outlines the detailed, dependency-ordered tasks for implementing the AI-native textbook with an integrated RAG chatbot. Tasks are grouped into phases, starting with foundational setup, followed by user story-specific implementations, and concluding with polish and cross-cutting concerns.

## Implementation Strategy
We will adopt an MVP-first approach, prioritizing User Story 1 (Learning with AI-Native Textbook) to deliver core value early. Subsequent user stories (optional features like Urdu translation and personalization) will be implemented incrementally. Each user story phase is designed to be independently testable.

## Phase 1: Setup
*(Project Initialization and Core Infrastructure Setup)*

- [ ] T001 Create Docusaurus project structure in `website/`
- [ ] T002 Create FastAPI project structure in `rag-backend/app/`
- [ ] T003 Configure `tsconfig.json` for TypeScript in `website/`
- [ ] T004 Create `requirements.txt` for Python dependencies in `rag-backend/`
- [ ] T005 Setup basic GitHub Actions workflow for Docusaurus build and deployment to GitHub Pages in `.github/workflows/build-deploy.yml`
- [ ] T006 Initialize Qdrant for vector storage (local/Docker setup initially, then configure for cloud) in `rag-backend/app/database/qdrant.py`
- [ ] T007 Initialize Neon PostgreSQL database and configure connection details in `rag-backend/app/database/connection.py`
- [ ] T008 Integrate `all-MiniLM-L6-v2` embedding model using `sentence-transformers` in `rag-backend/app/utils/embeddings.py`

## Phase 2: Foundational
*(Core System Components and Shared Functionality)*

- [ ] T009 Define `website/docusaurus.config.js` for auto sidebar generation and basic theme settings
- [ ] T010 Implement basic Docusaurus UI components (e.g., `website/src/components/Layout.js`, `website/src/components/HomepageFeatures.js`)
- [ ] T011 Implement FastAPI endpoint for health check (`/health`) in `rag-backend/app/api/endpoints/health.py`
- [ ] T012 Configure environment variables for RAG backend (`rag-backend/.env.example`)
- [ ] T013 Implement database connection management for Neon PostgreSQL using FastAPI's `Depends()` and `lifespan` events in `rag-backend/app/database/connection.py`
- [ ] T014 Set up Alembic for schema migrations for Neon PostgreSQL in `rag-backend/alembic/`

## Phase 3: User Story 1 - Learning with AI-Native Textbook (Priority: P1)
**Story Goal**: As a learner, I want to read the AI-native textbook and ask questions related to the content using the integrated RAG chatbot, so that I can quickly understand concepts and get clarifications without leaving the learning environment.
**Independent Test**: A user can navigate through the textbook chapters, select text to trigger the chatbot, ask a question, and receive an accurate, contextually relevant answer solely based on the book's content.

- [ ] T015 [US1] Create initial MDX content for "Introduction to Physical AI" chapter in `website/docs/01-introduction.md`
- [ ] T016 [P] [US1] Implement text selection UI logic for chapters in `website/src/components/RAGChatbot.js`
- [ ] T017 [P] [US1] Implement "Ask AI" button/trigger in `website/src/components/RAGChatbot.js`
- [ ] T018 [US1] Implement `rag_service.py` to encapsulate RAG logic and interaction with Qdrant/Neon in `rag-backend/app/services/rag_service.py`
- [ ] T019 [US1] Implement FastAPI endpoint for RAG queries (`/rag/query`) in `rag-backend/app/api/endpoints/rag.py`
- [ ] T020 [US1] Integrate Qdrant client for vector search operations within `rag-backend/app/services/rag_service.py`
- [ ] T021 [US1] Integrate Neon PostgreSQL for metadata storage (e.g., chunk content, source mapping) within `rag-backend/app/services/rag_service.py`
- [ ] T022 [US1] Develop script to chunk and embed textbook content, then load into Qdrant/Neon in `rag-backend/scripts/ingest_data.py`
- [ ] T023 [US1] Implement UI to display RAG chatbot responses in `website/src/components/RAGChatbot.js`
- [ ] T024 [US1] Implement logic to indicate when information is not found in the book within `website/src/components/RAGChatbot.js`
- [ ] T025 [US1] Create end-to-end test for RAG chatbot query flow (user selects text, asks question, gets response) in `website/tests/e2e/rag_flow.spec.js` (using Cypress/Playwright)
- [ ] T026 [US1] Create API integration tests for RAG query endpoint in `rag-backend/tests/integration/test_rag_api.py` (using Pytest)
- [ ] T027 [US1] Create unit tests for RAG service logic in `rag-backend/tests/unit/test_rag_service.py`

## Final Phase: Polish & Cross-Cutting Concerns
*(Optimization, Testing, and Optional Features)*

- [ ] T028 Optimize Docusaurus build process in `website/docusaurus.config.js`
- [ ] T029 Conduct performance testing for RAG chatbot latency
- [ ] T030 Conduct security review of RAG backend
- [ ] T031 Conduct accessibility review of Docusaurus UI
- [ ] T032 (Optional) Implement Urdu translation mechanism in `website/docusaurus.config.js` and `website/src/i18n/`
- [ ] T033 (Optional) Create "Personalize" chapter MDX in `website/docs/07-personalize.md`

## Dependency Graph (User Story Completion Order)

This feature prioritizes User Story 1. Optional features can be implemented after the core RAG chatbot functionality is stable and verified.

- User Story 1: Learning with AI-Native Textbook

## Parallel Execution Examples

Many tasks can be executed in parallel within User Story 1 and across different parts of the system:

- **Frontend Development (T016, T017, T023, T024)** can run in parallel with **Backend Development (T018, T019, T020, T021)**.
- **Content Creation (T015)** can run in parallel with **UI/Backend development**.
- **Testing (T025, T026, T027)** can be developed as their respective features become available, enabling a test-driven approach for each component.

## Suggested MVP Scope

The Minimum Viable Product (MVP) for this feature would encompass all tasks related to **User Story 1: Learning with AI-Native Textbook**. This includes the Docusaurus setup, FastAPI backend for RAG, integration with Qdrant/Neon, embedding model, and the core UI for querying the textbook content and displaying responses. This MVP ensures a functional AI-native textbook experience.

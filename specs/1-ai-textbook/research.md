# Research Findings: textbook-generation

## Docusaurus Testing Best Practices

**Decision**: For Docusaurus frontend, unit testing will focus on custom React components using Jest/Vitest, while integration testing will follow general web practices. End-to-end testing will utilize Cypress or Playwright for critical user journeys.

**Rationale**: Docusaurus is React-based, so standard React testing practices apply. E2E testing is crucial for validating the full user experience, especially for documentation sites.

**Alternatives considered**: Less emphasis on E2E testing (rejected due to importance of full user journey validation).

## FastAPI Testing Best Practices

**Decision**: For the FastAPI backend, Pytest will be used for unit, integration, and API testing. TestClient will be used for synchronous testing, httpx/AsyncClient for asynchronous, and pytest-asyncio for async test support. Dependency injection will be leveraged for mocking.

**Rationale**: Pytest is the recommended framework for FastAPI. TestClient and httpx provide efficient ways to test the API without a running server, and dependency injection allows for effective isolation of units.

**Alternatives considered**: unittest (rejected in favor of Pytest's simplicity and readability).

## Qdrant Best Practices for RAG Systems

**Decision**: Qdrant will be used with a schema design that includes metadata for filtering. Both dense and sparse vector indexing will be considered, with built-in compression (quantization) for performance. Hybrid search and re-ranking techniques will be explored for query optimization. Data ingestion will involve chunking tailored to data types, and evaluation will use frameworks like Ragas.

**Rationale**: Qdrant's features support efficient and precise RAG. Metadata filtering, hybrid search, and re-ranking improve retrieval quality. Optimized indexing and compression are crucial for free-tier usage.

**Alternatives considered**: Simpler schema or indexing (rejected due to potential impact on RAG accuracy and performance).

## Neon PostgreSQL Best Practices with FastAPI

**Decision**: Asynchronous drivers like `asyncpg` with connection pooling and FastAPI's `Depends()` will be used for connection management. Alembic with SQLAlchemy will handle schema migrations. Environment variables (`python-dotenv`, Pydantic's `BaseSettings`) will manage credentials. Lifespan events will manage connection pool setup/teardown. Awareness of cold starts and caching will guide performance optimization for free-tier usage.

**Rationale**: Asynchronous drivers and connection pooling align with FastAPI's async nature for performance. Alembic/SQLAlchemy is a robust solution for schema migration. Environment variables are essential for secure credential management. Understanding free-tier limitations (cold starts) is critical for setting expectations.

**Alternatives considered**: Manual schema management (rejected due to complexity and error proneness); synchronous database access (rejected due to performance limitations with FastAPI).

## Free-Tier Embedding Models Comparison

**Decision**: `all-MiniLM-L6-v2` will be the primary choice for embeddings due to its balance of speed, accuracy, and small model size (384 dimensions), making it efficient for CPU-first and free-tier deployment. `FastEmbed` will be considered for its convenient integration with Qdrant. The `e5` family and `BGE` models remain strong alternatives if higher accuracy is needed for specific use cases, but with potentially larger embedding sizes.

**Rationale**: `all-MiniLM-L6-v2` offers a good balance of performance and resource efficiency for free-tier constraints. `FastEmbed` simplifies integration. The ability to run effectively on CPUs is a key advantage for minimizing costs.

**Alternatives considered**: Larger models like `BGE-M3` or `Qwen3-Embedding` (rejected as primary due to potentially higher resource consumption and embedding sizes, though they remain strong candidates for specific high-accuracy needs).
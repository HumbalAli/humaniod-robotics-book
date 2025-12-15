# Research Findings for Physical AI & Humanoid Robotics Book

## Language/Version

### Recommended Technologies/Practices:
- **Frontend (Docusaurus):** TypeScript with Node.js 18.x or 20.x (LTS). Docusaurus v3.
- **Backend (RAG Chatbot):** Python 3.9+ (preferably 3.10 or 3.11) with FastAPI.

### Rationale:
- TypeScript for Docusaurus enhances code quality, maintainability, and developer experience with static typing. Node.js LTS versions ensure stability.
- Python is the explicit choice for FastAPI, which is a core component. Newer Python versions offer performance improvements. FastAPI provides high-performance APIs with automatic documentation.

### Key Considerations:
- Well-established and compatible tech stack.
- Excellent community support and extensive libraries.

## Primary Dependencies

### Recommended Technologies/Practices:
- **Docusaurus AI / docusaurus-plugin-chat-page / LangChain's DocusaurusLoader:** For Docusaurus-based chatbot integration and content ingestion.
- **Qdrant (Vector Database):** For efficient vector storage and retrieval.
- **Neon (Serverless PostgreSQL with `pgvector`):** As an alternative/complementary vector store and relational database.
- **FastAPI:** For the RAG chatbot's backend API.

### Rationale:
- Docusaurus-specific plugins and LangChain simplify content loading for RAG.
- Qdrant offers efficient vector search with free cloud tier and compression for minimal embeddings.
- Neon provides a serverless PostgreSQL with `pgvector` for vector storage and integrates with FastAPI, with a free tier.
- FastAPI is a high-performance framework for building RAG backends, easily integrating with Qdrant and Neon.

### Key Considerations:
- All components offer free-tier compatibility or are open-source.
- Qdrant's compression and `pgvector`'s efficiency help manage minimal embeddings.

## Testing

### Recommended Technologies/Practices:
- **Docusaurus Textbook:**
    - **Content Quality:** Vale for linting/style checking. Local development for visual inspection.
    - **Interactive Code:** Expo Snack for testing interactive code.
    - **CI/CD:** GitHub Actions for automated build/deployment checks (broken links, structural issues).
- **FastAPI RAG Chatbot:**
    - **Unit/Integration Testing:** Pytest for individual components and interactions. Postman for API validation.
    - **E2E Testing (Conversational):** Botium or TestMyBot for simulating user conversations.
    - **Performance Testing:** JMeter or Locust for load testing.
    - **RAG-Specific Evaluation:** RAGAS and DeepEval for faithfulness, answer relevancy, context precision, context recall. LLM as a Judge.

### Rationale:
- Comprehensive testing ensures content accuracy and chatbot reliability.
- Specialized RAG evaluation frameworks are crucial for quantifying the reliability and accuracy of RAG systems against hallucination and relevance.

### Key Considerations:
- Dual approach needed for static site vs. dynamic chatbot.
- Automation through CI/CD is essential.

## Target Platform

### Recommended Technologies/Practices:
- **Docusaurus Textbook:** GitHub Pages for static site hosting.
- **FastAPI RAG Chatbot Backend:**
    - **Application Hosting:** Leapcell (free-tier with FastAPI support, auto-scaling, built-in DB).
    - **Vector Database:** Qdrant Cloud (free-tier cluster, subject to inactivity suspension).
    - **PostgreSQL Database:** Neon (free-tier serverless PostgreSQL, scales to zero).

### Rationale:
- GitHub Pages is ideal for static Docusaurus sites, free, and integrates with GitHub Actions.
- Leapcell provides free-tier FastAPI hosting with good performance and scaling.
- Qdrant Cloud offers a free vector database suitable for prototyping.
- Neon provides a free, scalable PostgreSQL database that idles when not in use, reducing costs.

### Key Considerations:
- Combining services to leverage free tiers.
- GitHub Actions for Docusaurus deployment automation.
- Awareness of Qdrant Cloud free-tier limitations (inactivity suspension).

## Performance Goals

### Recommended Technologies/Practices:
- **Docusaurus Website:** Sub-second page load times.
    - Asset optimization (image compression, lazy loading, code splitting).
    - Leverage Docusaurus Faster project (Rust-based tools).
    - Optimize Core Web Vitals.
    - Standard web performance practices (CDN, minification).
- **FastAPI RAG Chatbot:** Sub-100ms response times for RAG queries.
    - Pre-embedding the corpus.
    - Approximate Nearest Neighbor (ANN) search.
    - Limiting Top-K retrieval (5-10 documents).
    - Compressing embeddings (FP16/INT8).
    - Streaming responses.

### Rationale:
- Fast loading Docusaurus site improves user experience and SEO.
- Sub-100ms RAG response times are critical for user perception.
- Pre-embedding and ANN reduce latency from embedding generation and search.
- Compression and streaming optimize resource usage and perceived speed.

### Key Considerations:
- Free-tier components: MongoDB Atlas, Pinecone Serverless (for vector storage alternatives), HuggingFace SentenceTransformer models (e.g., `all-MiniLM-L6-v2`), Google Gemini (`gemini-2.0-flash`).
- Minimal embeddings strategy: Efficient embedding models, pre-computation, embedding compression.

## Scale/Scope

### Expected Scale and Scope:
- **Number of Users:** Initially up to 50,000 monthly active users using free tiers (Amazon Cognito, AWS Lambda). Designed for smooth transition to paid tiers.
- **Content Size:** Technical books typically span several hundred to over a thousand pages. Storage with Amazon S3 (5 GB free tier). Metadata with Amazon DynamoDB (25 GB free tier).
- **Future Expansion:** Modular architecture with AWS Lambda/API Gateway. S3 for flexible content updates. Potential for advanced search, community interaction, interactive learning, personalized recommendations, offline access.

### Alignment with Free-Tier Architecture and Minimal Embeddings Constraint:
- **Free-Tier Adherence:** Leveraging free tiers of cloud providers (AWS S3, CloudFront, Cognito, Lambda, DynamoDB) to minimize initial operational costs.
- **Minimal Embeddings Strategy:** Prioritize keyword matching for initial search, rule-driven logic for recommendations. Advanced AI features with significant embeddings phased in later. Focus on efficient content delivery and intuitive reading interface.

### Rationale:
- Serverless architecture (AWS Lambda) provides scalability.
- S3 and DynamoDB free tiers offer ample storage for content and metadata.
- Modular design allows for future feature expansion without major refactoring.
- Prioritizing cost-efficiency and resource utilization for initial launch.

### Key Considerations:
- Careful management of free-tier limits.
- Strategic phasing of advanced, resource-intensive AI features.

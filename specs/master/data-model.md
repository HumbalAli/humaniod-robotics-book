# Data Model for Physical AI & Humanoid Robotics Book

## Entities

### Book
- **Description:** Represents the textbook content.
- **Fields:**
    - `id`: Unique identifier for the book.
    - `title`: Title of the book (e.g., "Physical AI & Humanoid Robotics — Essentials").
    - `authors`: List of authors.
    - `chapters`: List of Chapter entities.
    - `language`: Primary language of the book (e.g., "English", "Urdu").
    - `version`: Version of the book.
    - `publication_date`: Date of publication.

### Chapter
- **Description:** Represents a chapter within the book.
- **Fields:**
    - `id`: Unique identifier for the chapter.
    - `book_id`: Foreign key to the Book entity.
    - `title`: Title of the chapter (e.g., "Introduction to Physical AI").
    - `order`: Order of the chapter within the book.
    - `content_path`: Path to the Markdown content file for the chapter.
    - `sections`: List of sections within the chapter (optional).

### User
- **Description:** Represents a user of the textbook and chatbot.
- **Fields:**
    - `id`: Unique user identifier (e.g., from authentication system like Amazon Cognito).
    - `preferences`: User-specific settings (e.g., theme, language preference for personalized features).
    - `reading_progress`: Map of `book_id` to `chapter_id` and `last_read_position` (for tracking progress).

### Chatbot
- **Description:** Represents an interaction with the RAG chatbot.
- **Fields:**
    - `id`: Unique identifier for the chatbot session.
    - `user_id`: Foreign key to the User entity.
    - `timestamp`: Timestamp of the interaction.
    - `queries`: List of user queries.
    - `responses`: List of chatbot responses.
    - `context_used`: References to book content used for RAG.

### Embedding (Conceptual - Managed by Qdrant/pgvector)
- **Description:** Vector representation of text chunks from the book content.
- **Fields:**
    - `id`: Unique identifier for the embedding.
    - `content_id`: Reference to the original text chunk (e.g., `chapter_id` + section_id + paragraph_id).
    - `vector`: The high-dimensional vector representation.
    - `text_chunk`: The original text segment.

## Relationships

- `Book` has many `Chapter`s.
- `User` has many `Chatbot` interactions (sessions).
- `Chatbot` interactions refer to `Book` content (implicitly through `context_used`).
- `Embedding`s are derived from `Chapter` content.

## Validation Rules

- Book `id`, `title` are required.
- Chapter `id`, `book_id`, `title`, `order`, `content_path` are required.
- User `id` is required.
- Chatbot `id`, `user_id`, `timestamp` are required.

## State Transitions (for Chatbot interactions)

- `Initial` -> `QueryReceived` -> `ContextRetrieved` -> `ResponseGenerated` -> `ResponseSent`

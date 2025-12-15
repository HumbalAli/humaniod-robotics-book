from agents import Agent, Runner, OpenAIChatCompletionsModel, AsyncOpenAI
from agents import set_tracing_disabled, function_tool
import os
from dotenv import load_dotenv
from agents import enable_verbose_stdout_logging

enable_verbose_stdout_logging()

load_dotenv()
set_tracing_disabled(disabled=True)

groq_api_key = os.getenv("GROQ_API_KEY")
provider = AsyncOpenAI(
    api_key=groq_api_key,
    base_url="https://api.groq.com/openai/v1"
)

model = OpenAIChatCompletionsModel(
    model="llama-3.1-8b-instant",  # Using a current Groq-compatible model
    openai_client=provider
)

import cohere
from qdrant_client import QdrantClient
import groq

# Get API keys and URLs from environment variables
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Cohere client
cohere_client = cohere.Client(COHERE_API_KEY)

# Initialize Groq client
groq_client = groq.Groq(api_key=GROQ_API_KEY)

# Connect to Qdrant
qdrant = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY
)



def get_embedding(text):
    """Get embedding vector from Cohere Embed v3"""
    response = cohere_client.embed(
        model="embed-english-v3.0",
        input_type="search_query",  # Use search_query for queries
        texts=[text],
    )
    return response.embeddings[0]  # Return the first embedding


@function_tool
def retrieve(query):
    embedding = get_embedding(query)
    result = qdrant.query_points(
        collection_name="Robotics-book",
        query=embedding,
        limit=5
    )
    return [point.payload["text"] for point in result.points]



agent = Agent(
    name="Assistant",
    instructions="""
You are an AI tutor for the Physical AI & Humanoid Robotics textbook.
To answer the user question, first call the tool `retrieve` with the user query.
Use ONLY the returned content from `retrieve` to answer.
If the answer is not in the retrieved content, say "I don't know".
""",
    model=model,
    tools=[retrieve]
)


result = Runner.run_sync(
    agent,
    input="what is physical ai?",
)

print(result.final_output)
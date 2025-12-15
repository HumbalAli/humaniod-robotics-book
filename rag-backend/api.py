import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
import sys
import logging
from groq import Groq

# Load environment variables
load_dotenv()

# Add the rag-backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the RAG components
from retreving import retrieve, groq_client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="RAG Chatbot API",
    version="1.0.0",
    description="API for interacting with the Retrieval Augmented Generation chatbot for the Physical AI & Humanoid Robotics Book."
)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatMessage(BaseModel):
    content: str
    role: str = "user"

class ChatRequest(BaseModel):
    message: str
    user_id: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    context_references: List[str] = []

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat endpoint for the RAG system"""
    try:
        logger.info(f"Received chat request: {request.message}")

        # Retrieve relevant context from the vector database
        retrieved_context = retrieve(request.message)

        # Format the context for the LLM
        context_str = "\n".join(retrieved_context) if retrieved_context else "No specific context found in the knowledge base."

        # Create the prompt for the LLM
        prompt = f"""
        You are an AI tutor for the Physical AI & Humanoid Robotics textbook.

        Context from the knowledge base:
        {context_str}

        User question: {request.message}

        Please provide a helpful answer based on the context provided. If the answer is not in the context, say "I don't know based on the provided materials, but I can provide general information about Physical AI & Humanoid Robotics."
        """

        # Generate response using Groq
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",  # Using a model available on Groq
        )

        response_text = chat_completion.choices[0].message.content
        logger.info(f"LLM response: {response_text}")

        return ChatResponse(
            response=response_text,
            context_references=retrieved_context[:3]  # Return top 3 context snippets
        )
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "RAG Chatbot API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
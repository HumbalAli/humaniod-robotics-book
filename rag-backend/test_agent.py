import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the rag-backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the agent components
from agent import Runner, agent

def test_agent():
    """Test the agent with sample queries"""
    print("Testing RAG Agent...")

    # Test queries
    test_queries = [
        "What is humanoid robotics?",
        "Explain physical AI",
        "What are the key concepts in the book?"
    ]

    for query in test_queries:
        print(f"\nQuery: {query}")
        try:
            result = Runner.run_sync(
                agent,
                input=query,
            )
            print(f"Response: {result.final_output}")
        except Exception as e:
            print(f"Error: {e}")

    print("\nTesting completed!")

if __name__ == "__main__":
    test_agent()
// Vercel API route for RAG query
// This is a simplified version that works with Vercel's serverless constraints
// For production use with actual RAG, you'd want to connect to a hosted backend service

import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, user_id, session_id } = req.body;

    if (!query || !user_id) {
      return res.status(400).json({ error: 'Query and user_id are required.' });
    }

    // Initialize the Gemini model
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create a prompt that incorporates knowledge about Physical AI & Humanoid Robotics
    const prompt = `You are an AI assistant for the Physical AI & Humanoid Robotics book. Answer the following question based on general knowledge about robotics, AI, and humanoid robotics: ${query}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const response_data = {
      response: text,
      context_references: [] // In this simplified version, we don't have specific context references
    };

    res.status(200).json(response_data);
  } catch (error) {
    console.error('Error in query endpoint:', error);

    const fallback_response = {
      response: "I'm sorry, I encountered an error processing your question. The RAG backend might not be running. You can ask me anything about Physical AI & Humanoid Robotics!",
      context_references: []
    };

    res.status(500).json(fallback_response);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
import React, { useState, useEffect } from 'react';
import Chatbot from './Chatbot';

export default function ChatbotWrapper() {
  const [mounted, setMounted] = useState(false);

  // Only render Chatbot on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <Chatbot /> : null;
}

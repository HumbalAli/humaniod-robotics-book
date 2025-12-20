import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './Chatbot.module.css';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant for Physical AI & Humanoid Robotics. Ask me anything about robotics, AI, or the book content!",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send request to FastAPI backend
      const response = await fetch('https://humbal-backend.hf.space/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue, user_id: 'website_user' }),
      });

      if (response.ok) {
        const data = await response.json();

        // FastAPI response might have 'answer', 'error', or fallback
        const content =
          data.answer ||
          data.error ||
          "I'm sorry, I don't know the answer to that.";

        const botMessage: Message = {
          id: Date.now().toString(),
          content,
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Backend returned non-200
        const fallbackMessage: Message = {
          id: Date.now().toString(),
          content: "I'm sorry, I couldn't process your question. The backend might not be running.",
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error. The backend might not be running.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.chatbotHeader}>
        <h3>🤖 Robotics AI Assistant</h3>
        <p>Ask questions about Physical AI & Humanoid Robotics</p>
      </div>

      <div className={styles.chatbotMessages}>
        {messages.map(message => (
          <div
            key={message.id}
            className={clsx(
              styles.message,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage
            )}
          >
            <div className={styles.messageContent}>{message.content}</div>
            <div className={styles.messageTimestamp}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className={clsx(styles.message, styles.assistantMessage)}>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.chatbotInputForm}>
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Ask about robotics, AI, or book content..."
          className={styles.chatbotInput}
          disabled={isLoading}
        />
        <button
          type="submit"
          className={styles.chatbotButton}
          disabled={isLoading || !inputValue.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './Chatbot.module.css';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_RAG_BACKEND || 'http://localhost:8000/chat';

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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

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
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue, user_id: 'website-user' }),
      });

      let botMessage: Message;

      if (response.ok) {
        const data = await response.json();
        botMessage = {
          id: Date.now().toString(),
          content: data.response || "Sorry, I don't have an answer for that.",
          role: 'assistant',
          timestamp: new Date(),
        };
      } else {
        botMessage = {
          id: Date.now().toString(),
          content: "I'm sorry, I couldn't process your question. The RAG backend might not be running.",
          role: 'assistant',
          timestamp: new Date(),
        };
      }

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "I'm sorry, there was an error communicating with the backend.",
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);
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
        {messages.map(msg => (
          <div
            key={msg.id}
            className={clsx(
              styles.message,
              msg.role === 'user' ? styles.userMessage : styles.assistantMessage
            )}
          >
            <div className={styles.messageContent}>{msg.content}</div>
            <div className={styles.messageTimestamp}>
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className={clsx(styles.message, styles.assistantMessage)}>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <span />
                <span />
                <span />
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

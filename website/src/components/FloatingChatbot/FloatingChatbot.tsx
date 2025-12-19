import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './FloatingChatbot.module.css';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_RAG_BACKEND || 'http://localhost:8000/chat';

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleChatbot = () => setIsOpen(prev => !prev);

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

      const botMessage: Message = response.ok
        ? {
            id: Date.now().toString(),
            content: (await response.json()).response || "Sorry, I don't have an answer for that.",
            role: 'assistant',
            timestamp: new Date(),
          }
        : {
            id: Date.now().toString(),
            content: "I'm sorry, I couldn't process your question. The RAG backend might not be running.",
            role: 'assistant',
            timestamp: new Date(),
          };

      setMessages(prev => [...prev, botMessage]);
    } catch {
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
    <>
      {/* Floating Chatbot Button */}
      <button
        className={clsx(styles.chatbotButton, isOpen && styles.hidden)}
        onClick={toggleChatbot}
        aria-label="Open AI Assistant"
      >
        <div className={styles.chatbotIcon}>🤖</div>
      </button>

      {/* Chatbot Sidebar */}
      <div className={clsx(styles.chatbotOverlay, isOpen && styles.open)}>
        <div className={styles.chatbotSidebar}>
          <div className={styles.chatbotHeader}>
            <h3>🤖 Robotics AI Assistant</h3>
            <button
              className={styles.closeButton}
              onClick={toggleChatbot}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className={styles.chatMessages}>
            {messages.map(msg => (
              <div key={msg.id} className={styles.message}>
                <div
                  className={clsx(
                    styles.messageContent,
                    msg.role === 'user' ? styles.userMessage : styles.assistantMessage
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={styles.message}>
                <div className={clsx(styles.messageContent, styles.assistantMessage)}>
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

          <form onSubmit={handleSubmit} className={styles.chatInputArea}>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Ask about robotics, AI, or book content..."
              className={styles.chatInput}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={isLoading || !inputValue.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Overlay background */}
      {isOpen && <div className={styles.overlayBackground} onClick={toggleChatbot} />}
    </>
  );
};

export default FloatingChatbot;

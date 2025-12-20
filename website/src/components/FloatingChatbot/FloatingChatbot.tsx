import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './FloatingChatbot.module.css';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        "Hello! I'm your AI assistant for Physical AI & Humanoid Robotics. Ask me anything about robotics, AI, or the book content!",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Capture input before clearing
    const userInput = inputValue;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://humbal-backend.hf.space/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput, // use captured value
          user_id: 'website-user',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: Date.now().toString(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // fallback if backend not available
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            content:
              "I'm sorry, I couldn't process your question right now. The RAG backend might not be running. You can ask me anything about Physical AI & Humanoid Robotics!",
            role: 'assistant',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content:
            "I'm sorry, I encountered an error. The RAG backend might not be running. You can ask me anything about Physical AI & Humanoid Robotics!",
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
          {/* Header */}
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

          {/* Messages */}
          <div className={styles.chatMessages}>
            {messages.map(message => (
              <div key={message.id} className={styles.message}>
                <div
                  className={clsx(
                    styles.messageContent,
                    message.role === 'user'
                      ? styles.userMessage
                      : styles.assistantMessage
                  )}
                >
                  {message.content}
                </div>
                <div className={styles.messageTimestamp}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={styles.message}>
                <div
                  className={clsx(styles.messageContent, styles.assistantMessage)}
                >
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

          {/* Input */}
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

      {/* Background overlay */}
      {isOpen && (
        <div className={styles.overlayBackground} onClick={toggleChatbot} />
      )}
    </>
  );
};

export default FloatingChatbot;

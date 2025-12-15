import React, { useEffect } from 'react';
import FloatingChatbot from './FloatingChatbot';

// This component will be added to all pages via the theme configuration
const FloatingChatbotWrapper: React.FC = () => {
  useEffect(() => {
    // This component is rendered once in the layout
  }, []);

  return <FloatingChatbot />;
};

export default FloatingChatbotWrapper;
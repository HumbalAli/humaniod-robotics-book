import React from 'react';
import FloatingChatbot from '../components/FloatingChatbot/FloatingChatbot';

// This component wraps the entire app to ensure the floating chatbot appears on all pages
export default function Root({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <>
      {children}
      <FloatingChatbot />
    </>
  );
}
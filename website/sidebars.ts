import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Manual sidebar organization following book structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Part I: Foundations',
      collapsed: false,
      items: [
        'introduction-to-physical-ai',
        'basics-of-humanoid-robotics',
        'ros2-fundamentals',
      ],
    },
    {
      type: 'category',
      label: 'Part II: Implementation',
      collapsed: false,
      items: [
        'digital-twin-simulation',
        'vision-language-action-systems',
      ],
    },
    {
      type: 'category',
      label: 'Part III: Advanced Topics',
      collapsed: false,
      items: [
        'capstone-ai-robot-pipeline',
      ],
    },
    // Legacy content that might need reorganization
    {
      type: 'category',
      label: 'Supplementary Materials',
      collapsed: true,
      items: [
        'robot-hardware-mechanics',
        'robot-operating-systems-ros',
        'robot-perception-sensors',
        'robot-control-planning',
        'robot-applications-integration',
      ],
    },
  ],
};

export default sidebars;

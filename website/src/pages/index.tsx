import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import ChatbotWrapper from '../components/Chatbot/ChatbotWrapper';
import FloatingChatbot from '../components/FloatingChatbot/FloatingChatbot';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <Heading as="h1" className="hero__title fade-in-up">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle fade-in-up" style={{animationDelay: '0.2s'}}>
            {siteConfig.tagline}
          </p>
          <div className={clsx(styles.buttons, 'fade-in-up')} style={{animationDelay: '0.4s'}}>
            <Link
              className="button button--primary button--lg"
              to="/docs/introduction-to-physical-ai">
              📚 Start Reading Now
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/docs/introduction-to-physical-ai">
              📖 Browse Chapters
            </Link>
          </div>
        </div>

        {/* Animated background elements */}
        <div className={styles.heroBackground}>
          <div className={clsx(styles.technicalDoodle, styles.technicalDoodle__grid)}></div>
          <div className={clsx(styles.technicalDoodle, styles.technicalDoodle__circuit1)}></div>
          <div className={clsx(styles.technicalDoodle, styles.technicalDoodle__circuit2)}></div>
          <div className={clsx(styles.technicalDoodle, styles.technicalDoodle__circuit3)}></div>
          <div className={clsx(styles.backgroundElement, styles.element1)}></div>
          <div className={clsx(styles.backgroundElement, styles.element2)}></div>
          <div className={clsx(styles.backgroundElement, styles.element3)}></div>
        </div>
      </div>
    </header>
  );
}

function HomepageChapters() {
  const chapters = [
    {
      id: '01-introduction-to-physical-ai',
      title: 'Introduction to Robotics',
      description: 'Explore the fundamentals of robotics, history, components, and applications.',
      icon: '🤖',
      color: 'slate',
      link: '/docs/introduction-to-physical-ai'
    },
    {
      id: '02-robot-hardware-mechanics',
      title: 'Robot Hardware & Mechanics',
      description: 'Learn about mechanical structure, actuators, sensors, and power systems.',
      icon: '🦾',
      color: 'green',
      link: '/docs/robot-hardware-mechanics'
    },
    {
      id: '03-robot-operating-systems-ros',
      title: 'Robot Operating Systems (ROS)',
      description: 'Master the Robot Operating System for building robotic applications.',
      icon: '📡',
      color: 'purple',
      link: '/docs/robot-operating-systems-ros'
    },
    {
      id: '04-robot-perception-sensors',
      title: 'Robot Perception & Sensors',
      description: 'Understand vision systems, range sensors, and environmental mapping.',
      icon: '🎮',
      color: 'orange',
      link: '/docs/robot-perception-sensors'
    },
    {
      id: '05-robot-control-planning',
      title: 'Robot Control & Planning',
      description: 'Explore motion planning algorithms and control systems for robots.',
      icon: '👁️',
      color: 'teal',
      link: '/docs/robot-control-planning'
    },
    {
      id: '06-robot-applications-integration',
      title: 'Robot Applications & Integration',
      description: 'Discover industrial, service, and mobile robotics applications.',
      icon: '🚀',
      color: 'indigo',
      link: '/docs/robot-applications-integration'
    }
  ];

  return (
    <section id="chapters-section" className={clsx('homepage-chapters', styles.chaptersSection)}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            📚 Complete Book Chapters
          </Heading>
          <p className={styles.sectionSubtitle}>
            Dive deep into each topic with comprehensive, hands-on content
          </p>
        </div>

        <div className={styles.chaptersGrid}>
          {chapters.map((chapter, index) => (
            <Link
              key={chapter.id}
              to={chapter.link}
              className={clsx(
                styles.chapterCard,
                styles[`chapterCard--${chapter.color}`],
                'fade-in-up'
              )}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className={styles.chapterIcon}>{chapter.icon}</div>
              <div className={styles.chapterContent}>
                <h3 className={styles.chapterTitle}>
                  Chapter {chapter.id.split('-')[0].replace('0', '')}: {chapter.title}
                </h3>
                <p className={styles.chapterDescription}>{chapter.description}</p>
                <div className={styles.chapterMeta}>
                  <span className={styles.chapterId}>Chapter {chapter.id.split('-')[0].replace('0', '')}</span>
                  <span className={styles.readMore}>Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="A comprehensive textbook on Physical AI and Humanoid Robotics">
      <HomepageHeader />
      <main>
        <HomepageChapters />
        <section className={styles.chatbotSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Heading as="h2" className={styles.sectionTitle}>
                🤖 Ask the Robotics AI Assistant
              </Heading>
              <p className={styles.sectionSubtitle}>
                Have questions about Physical AI & Humanoid Robotics? Ask our AI assistant!
              </p>
            </div>
            <div className={styles.chatbotContainer}>
              {/* Use the client-only wrapper */}
              <ChatbotWrapper />
            </div>
          </div>
        </section>
      </main>
      <FloatingChatbot />
    </Layout>
  );
}

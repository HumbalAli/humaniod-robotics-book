import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type CalloutType = 'note' | 'tip' | 'info' | 'caution' | 'danger' | 'success';

interface CalloutProps {
  children: ReactNode;
  type?: CalloutType;
}

const typeMap: Record<CalloutType, {icon: string; label: string}> = {
  note: {
    icon: '📝',
    label: 'Note',
  },
  tip: {
    icon: '💡',
    label: 'Tip',
  },
  info: {
    icon: 'ℹ️',
    label: 'Info',
  },
  caution: {
    icon: '⚠️',
    label: 'Caution',
  },
  danger: {
    icon: '❌',
    label: 'Danger',
  },
  success: {
    icon: '✅',
    label: 'Success',
  },
};

export function Callout({children, type = 'info'}: CalloutProps): ReactNode {
  const {icon, label} = typeMap[type];

  return (
    <div className={clsx(styles.callout, styles[type])}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
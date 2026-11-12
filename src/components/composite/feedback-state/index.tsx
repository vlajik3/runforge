import type { ReactElement, ReactNode } from 'react';
import { Icon } from '../../shared/icon';
import type { IIconName } from '../../shared/icon/interfaces';
import styles from './feedback-state.module.scss';

interface IFeedbackStateProps {
  icon: IIconName;
  title: string;
  description: string;
  children: ReactNode;
}

export function FeedbackState({
  icon,
  title,
  description,
  children,
}: IFeedbackStateProps): ReactElement {
  return (
    <div className={styles.feedback}>
      <span className={styles.feedback__icon}>
        <Icon name={icon} size={24} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}

import type { ReactElement } from 'react';
import styles from './run-loading.module.scss';

export function RunLoading(): ReactElement {
  return (
    <div className={styles.loading}>
      <span className={styles.loading__label}>Получаем запуски…</span>
      <div>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={styles.loading__row}>
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
    </div>
  );
}

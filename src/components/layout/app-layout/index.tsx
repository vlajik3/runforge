import type { ReactElement, ReactNode } from 'react';
import { Icon } from '../../shared/icon';
import { Link } from '../../shared/link';
import styles from './app-layout.module.scss';

interface IAppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: IAppLayoutProps): ReactElement {
  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>
        <Link className={styles.brand} href="./">
          <span className={styles.brand__icon}>
            <Icon name="cloud" size={24} />
          </span>
          Runforge
        </Link>
        <div className={styles.sidebar__workspace}>
          <span className={styles.sidebar__avatar}>R</span>
          <div>
            Рабочее пространство<span className={styles.sidebar__caption}>Локальное окружение</span>
          </div>
        </div>
        <nav className={styles.navigation}>
          <span className={styles.navigation__label}>ОБЗОР</span>
          <Link href="#main" className={styles.navigation__link}>
            <Icon name="runs" />
            Запуски
            <Icon name="arrow" size={16} />
          </Link>
        </nav>
        <div className={styles.sidebar__footer}>
          <Icon name="terminal" size={20} />
          <p>
            От идеи до результата.<span>Одно рабочее пространство.</span>
          </p>
          <div className={styles.sidebar__connection}>
            <span />
            Демонстрационный режим
          </div>
        </div>
      </nav>
      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <span>
            Рабочее пространство <span className={styles.topbar__separator}>/</span>{' '}
            <strong>Запуски</strong>
          </span>
          <span className={styles.topbar__badge}>DEMO WORKSPACE</span>
        </header>
        <main id="main" className={styles.main}>
          {children}
        </main>
        <footer className={styles.footer}>
          <span>Runforge · Запуски AI-агентов</span>
          <span>Запуски · логи · результаты</span>
        </footer>
      </div>
    </div>
  );
}

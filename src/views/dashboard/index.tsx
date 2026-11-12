import type { ReactElement } from 'react';
import { Button } from '../../components/shared/button';
import { Icon } from '../../components/shared/icon';
import { RunDetailsModal } from './components/run-details-modal';
import { RunFilters } from './components/run-filters';
import { RunList } from './components/run-list';
import { RunLoading } from './components/run-loading';
import { RunError } from './components/run-error';
import { RunEmpty } from './components/run-empty';
import { useDashboard } from './hooks/useDashboard';
import styles from './dashboard.module.scss';

export function Dashboard(): ReactElement {
  const {
    runs,
    isLoading,
    hasError,
    filters,
    selectedRun,
    visibleRuns,
    hasActiveFilters,
    updateFilters,
    resetFilters,
    retry,
    openDetails,
    closeDetails,
  } = useDashboard();

  return (
    <>
      <header className={styles.heading}>
        <div>
          <h1>Запуски агентов</h1>
          <p>Отслеживайте выполнение задач — от первого шага до результата.</p>
        </div>
        <div className={styles.heading__mark}>
          <Icon name="runs" size={36} />
          <span>RUN / OBSERVE / ITERATE</span>
        </div>
      </header>
      <section className={styles.panel}>
        <div className={styles.panel__header}>
          <h2>
            <Icon name="terminal" size={18} />
            Все запуски<span>{String(runs.length).padStart(2, '0')}</span>
          </h2>
          <span className={styles.panel__source}>
            ИСТОРИЯ <span>·</span> RUNFORGE
          </span>
        </div>
        <RunFilters filters={filters} runs={runs} onUpdate={updateFilters} />
        {isLoading ? (
          <RunLoading />
        ) : hasError ? (
          <RunError onRetry={retry} />
        ) : visibleRuns.length ? (
          <RunList runs={visibleRuns} onOpen={openDetails} />
        ) : (
          <RunEmpty onReset={resetFilters} />
        )}
        <div className={styles.panel__footer}>
          <span>
            {isLoading
              ? 'Загрузка запусков'
              : hasError
                ? 'Ошибка загрузки'
                : `Показано ${visibleRuns.length} из ${runs.length} запусков`}
          </span>
          {hasActiveFilters && (
            <Button variant="text" className={styles.panel__reset} onClick={resetFilters}>
              Сбросить фильтры
              <Icon name="cross" size={12} />
            </Button>
          )}
        </div>
      </section>
      <div className={styles.note}>
        <Icon name="clock" size={14} />
        <span>Даты и время указаны в вашем часовом поясе.</span>
        <span className={styles.note__hint}>
          Выберите запуск, чтобы увидеть логи и результат <Icon name="arrow" size={13} />
        </span>
      </div>
      <RunDetailsModal run={selectedRun} onClose={closeDetails} />
    </>
  );
}

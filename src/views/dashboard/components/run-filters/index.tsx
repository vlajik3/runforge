import type { ReactElement } from 'react';
import type { IRun } from '../../../../api/modules/dashboard/interfaces';
import { Button } from '../../../../components/shared/button';
import { Icon } from '../../../../components/shared/icon';
import { filterStatuses, sortOptions, statusLabels } from '../../constants';
import type { IRunFilters } from '../../interfaces';
import { isRunSort } from '../../utils';
import styles from './run-filters.module.scss';

interface IRunFiltersProps {
  filters: IRunFilters;
  runs: IRun[];
  onUpdate: (changes: Partial<IRunFilters>, shouldReplace?: boolean) => void;
}

export function RunFilters({ filters, runs, onUpdate }: IRunFiltersProps): ReactElement {
  return (
    <div className={styles.filters}>
      <div className={styles.filters__statuses}>
        {filterStatuses.map((status) => (
          <Button
            key={status}
            variant="ghost"
            isActive={filters.status === status}
            onClick={(): void => onUpdate({ status })}
          >
            {statusLabels[status]}{' '}
            <span className={styles.filters__count}>
              {status === 'all' ? runs.length : runs.filter((run) => run.status === status).length}
            </span>
          </Button>
        ))}
      </div>
      <div className={styles.filters__tools}>
        <div className={styles.filters__search}>
          <label htmlFor="run-search" className={styles.filters__label}>
            Поиск запусков
          </label>
          <span className={styles.filters__input}>
            <Icon name="search" size={17} />
            <input
              id="run-search"
              type="search"
              value={filters.query}
              placeholder="Название или репозиторий…"
              onChange={(event): void => onUpdate({ query: event.target.value }, true)}
            />
            {filters.query && (
              <Button
                variant="ghost"
                isIconOnly
                className={styles.filters__clear}
                onClick={(): void => onUpdate({ query: '' }, true)}
              >
                <Icon name="cross" size={14} />
              </Button>
            )}
          </span>
        </div>
        <label className={styles.filters__sort}>
          <span className={styles.filters__label}>Сортировка</span>
          <select
            value={filters.sort}
            onChange={(event): void => {
              if (isRunSort(event.target.value)) {
                onUpdate({ sort: event.target.value });
              }
            }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

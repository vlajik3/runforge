import type { ReactElement } from 'react';
import type { IRun } from '../../../../api/modules/dashboard/interfaces';
import { Button } from '../../../../components/shared/button';
import { Icon } from '../../../../components/shared/icon';
import { formatDuration, formatRunDate } from '../../utils';
import { RunStatusBadge } from '../run-status-badge';
import styles from './run-list.module.scss';

interface IRunListProps {
  runs: IRun[];
  onOpen: (run: IRun) => void;
}

export function RunList({ runs, onOpen }: IRunListProps): ReactElement {
  return (
    <table className={styles.list}>
      <caption className={styles.list__caption}>Список запусков AI-агентов</caption>
      <thead>
        <tr>
          <th scope="col">Запуск</th>
          <th scope="col">Репозиторий / ветка</th>
          <th scope="col">Статус</th>
          <th scope="col">Создан</th>
          <th scope="col">Время</th>
          <th scope="col">
            <span className={styles.list__caption}>Детали</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {runs.map((run) => (
          <tr
            key={run.id}
            onClick={(event): void => {
              event.currentTarget.querySelector('button')?.focus();
              onOpen(run);
            }}
          >
            <td className={styles.list__name}>
              <span className={styles.list__runid}>{run.id.replace('run-', '#')}</span>
              <Button
                variant="text"
                className={styles.list__trigger}
                onClick={(event): void => {
                  event.stopPropagation();
                  onOpen(run);
                }}
              >
                {run.name}
              </Button>
            </td>
            <td className={styles.list__repository}>
              <span>
                <Icon name="repository" size={13} />
                {run.repository}
              </span>
              <span className={styles.list__branch}>
                <Icon name="branch" size={12} />
                {run.branch}
              </span>
            </td>
            <td className={styles.list__status}>
              <RunStatusBadge status={run.status} />
            </td>
            <td className={styles.list__date}>
              <span className={styles['list__mobile-label']}>Создан</span>
              <span title={new Date(run.createdAt).toLocaleString('ru-RU')}>
                {formatRunDate(run.createdAt)}
              </span>
            </td>
            <td className={styles.list__duration}>
              <span className={styles['list__mobile-label']}>Длительность</span>
              {formatDuration(run.durationSeconds)}
            </td>
            <td className={styles.list__arrow}>
              <Icon name="arrow" size={16} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import type { ReactElement } from 'react';
import type { IRun } from '../../../../api/modules/dashboard/interfaces';
import { Modal } from '../../../../components/composite/modal';
import { Icon } from '../../../../components/shared/icon';
import { formatDuration } from '../../utils';
import { RunStatusBadge } from '../run-status-badge';
import styles from './run-details-modal.module.scss';

interface IRunDetailsModalProps {
  run: IRun | null;
  onClose: () => void;
}

export function RunDetailsModal({ run, onClose }: IRunDetailsModalProps): ReactElement {
  return (
    <Modal
      isOpen={run !== null}
      onClose={onClose}
      headerText={run ? `ДЕТАЛИ ЗАПУСКА / ${run.id}` : ''}
      footerText="Детали запуска"
      buttons={[{ text: 'Вернуться к списку', onClick: onClose }]}
    >
      {run && (
        <div className={styles.details}>
          <RunStatusBadge status={run.status} />
          <h2>{run.name}</h2>
          <div className={styles.details__metadata}>
            <div>
              <span className={styles.details__label}>Репозиторий</span>
              <span className={styles.details__value}>{run.repository}</span>
            </div>
            <div>
              <span className={styles.details__label}>Ветка</span>
              <span className={styles.details__value}>{run.branch}</span>
            </div>
            <div>
              <span className={styles.details__label}>Создан</span>
              <span className={styles.details__value}>
                {new Date(run.createdAt).toLocaleString('ru-RU')}
              </span>
            </div>
            <div>
              <span className={styles.details__label}>Длительность</span>
              <span className={styles.details__value}>{formatDuration(run.durationSeconds)}</span>
            </div>
          </div>
          <section>
            <h3>
              <Icon name="terminal" size={17} />
              Логи выполнения<span>Строк: {run.logs.length}</span>
            </h3>
            <pre className={styles.details__logs} tabIndex={0}>
              <code>{run.logs.length ? run.logs.join('\n') : 'Логов пока нет.'}</code>
            </pre>
          </section>
          {run.result && (
            <section className={styles.details__result}>
              <h3>Результат</h3>
              <p>{run.result}</p>
            </section>
          )}
        </div>
      )}
    </Modal>
  );
}

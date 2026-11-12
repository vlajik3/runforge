import type { ReactElement } from 'react';
import classNames from 'classnames';
import type { IRunStatus } from '../../../../api/modules/dashboard/interfaces';
import { Icon } from '../../../../components/shared/icon';
import { statusIcons, statusLabels } from '../../constants';
import styles from './run-status-badge.module.scss';

interface IRunStatusBadgeProps {
  status: IRunStatus;
}

export function RunStatusBadge({ status }: IRunStatusBadgeProps): ReactElement {
  return (
    <span className={classNames(styles.status, styles[`status--${status}`])}>
      <Icon name={statusIcons[status]} size={13} />
      {statusLabels[status]}
    </span>
  );
}

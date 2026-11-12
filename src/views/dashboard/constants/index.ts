import type { IRunStatus } from '../../../api/modules/dashboard/interfaces';
import type { IRunFilters, IRunFilterStatus, IRunSort } from '../interfaces';

export const statusLabels: Record<IRunFilterStatus, string> = {
  all: 'Все',
  queued: 'Queued',
  running: 'Running',
  succeeded: 'Succeeded',
  failed: 'Failed',
};

export const statusIcons: Record<IRunStatus, 'clock' | 'activity' | 'check' | 'cross'> = {
  queued: 'clock',
  running: 'activity',
  succeeded: 'check',
  failed: 'cross',
};

export const filterStatuses: IRunFilterStatus[] = [
  'all',
  'queued',
  'running',
  'succeeded',
  'failed',
];

export const sortOptions: { value: IRunSort; label: string }[] = [
  { value: 'created-desc', label: 'Сначала новые' },
  { value: 'created-asc', label: 'Сначала старые' },
  { value: 'duration-desc', label: 'Сначала долгие' },
  { value: 'duration-asc', label: 'Сначала быстрые' },
];

export const defaultFilters: IRunFilters = { status: 'all', query: '', sort: 'created-desc' };

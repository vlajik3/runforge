import type { IRun, IRunStatus } from '../../../api/modules/dashboard/interfaces';

export type IRunFilterStatus = IRunStatus | 'all';
export type IRunSort = 'created-desc' | 'created-asc' | 'duration-desc' | 'duration-asc';

export interface IRunFilters {
  status: IRunFilterStatus;
  query: string;
  sort: IRunSort;
}

export interface IRunsRequestState {
  runs: IRun[];
  isLoading: boolean;
  hasError: boolean;
}

export interface IDashboard extends IRunsRequestState {
  filters: IRunFilters;
  selectedRun: IRun | null;
  visibleRuns: IRun[];
  hasActiveFilters: boolean;
  updateFilters: (changes: Partial<IRunFilters>, shouldReplace?: boolean) => void;
  resetFilters: () => void;
  retry: () => void;
  openDetails: (run: IRun) => void;
  closeDetails: () => void;
}

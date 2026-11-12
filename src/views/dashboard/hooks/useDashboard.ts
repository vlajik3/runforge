import { useEffect, useState } from 'react';
import { getRuns } from '../../../api/modules/dashboard';
import type { IRun } from '../../../api/modules/dashboard/interfaces';
import { getFiltersFromUrl, getFiltersUrl, getVisibleRuns } from '../utils';
import type { IDashboard, IRunFilters, IRunsRequestState } from '../interfaces';

/** Управляет запросом, локальными условиями, историей URL и выбранным запуском. */
export function useDashboard(): IDashboard {
  const [runsRequestState, setRunsRequestState] = useState<IRunsRequestState>({
    runs: [],
    isLoading: true,
    hasError: false,
  });
  const [filters, setFilters] = useState<IRunFilters>(() =>
    getFiltersFromUrl(window.location.search),
  );
  const [selectedRun, setSelectedRun] = useState<IRun | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let isActive = true;

    getRuns().then(
      (runs): void => {
        if (isActive) {
          setRunsRequestState({ runs, isLoading: false, hasError: false });
        }
      },
      (): void => {
        if (isActive) {
          setRunsRequestState({ runs: [], isLoading: false, hasError: true });
        }
      },
    );

    return (): void => {
      isActive = false;
    };
  }, [requestVersion]);

  useEffect(() => {
    const handleHistoryNavigation = (): void =>
      setFilters(getFiltersFromUrl(window.location.search));
    window.addEventListener('popstate', handleHistoryNavigation);

    return (): void => window.removeEventListener('popstate', handleHistoryNavigation);
  }, []);

  const updateFilters = (changes: Partial<IRunFilters>, shouldReplace = false): void => {
    const nextFilters = { ...filters, ...changes };
    const url = getFiltersUrl(window.location.href, nextFilters);

    if (shouldReplace) {
      window.history.replaceState(null, '', url);
    } else {
      window.history.pushState(null, '', url);
    }

    setFilters(nextFilters);
  };

  const resetFilters = (): void => updateFilters({ status: 'all', query: '' });

  const retry = (): void => {
    setRunsRequestState({ runs: [], isLoading: true, hasError: false });
    setRequestVersion((version) => version + 1);
  };

  return {
    ...runsRequestState,
    filters,
    selectedRun,
    visibleRuns: getVisibleRuns(runsRequestState.runs, filters),
    hasActiveFilters: filters.status !== 'all' || Boolean(filters.query),
    updateFilters,
    resetFilters,
    retry,
    openDetails: setSelectedRun,
    closeDetails: (): void => setSelectedRun(null),
  };
}

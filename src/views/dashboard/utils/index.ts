import type { IRun } from '../../../api/modules/dashboard/interfaces';
import { defaultFilters, filterStatuses, sortOptions } from '../constants';
import type { IRunFilters, IRunFilterStatus, IRunSort } from '../interfaces';

/** Проверяет допустимость статуса из URL или контрола. */
export function isFilterStatus(value: string | null): value is IRunFilterStatus {
  return filterStatuses.some((status) => status === value);
}

/** Проверяет допустимость способа сортировки. */
export function isRunSort(value: string | null): value is IRunSort {
  return sortOptions.some((option) => option.value === value);
}

/** Читает условия из URL; неизвестные значения заменяет значениями по умолчанию. */
export function getFiltersFromUrl(search: string): IRunFilters {
  const params = new URLSearchParams(search);
  const status = params.get('status');
  const sort = params.get('sort');

  return {
    status: isFilterStatus(status) ? status : defaultFilters.status,
    query: params.get('q') ?? '',
    sort: isRunSort(sort) ? sort : defaultFilters.sort,
  };
}

/** Формирует URL условий, сохраняя посторонние параметры и якорь страницы. */
export function getFiltersUrl(href: string, filters: IRunFilters): string {
  const url = new URL(href);
  const values = {
    status: filters.status === 'all' ? '' : filters.status,
    q: filters.query,
    sort: filters.sort === defaultFilters.sort ? '' : filters.sort,
  };

  Object.entries(values).forEach(([key, value]): void => {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });

  return `${url.pathname}${url.search}${url.hash}`;
}

/** Совмещает поиск и статус, сортирует копию; неизвестная длительность всегда в конце. */
export function getVisibleRuns(runs: IRun[], filters: IRunFilters): IRun[] {
  const query = filters.query.trim().toLowerCase();
  const visibleRuns = runs.filter(
    (run) =>
      (filters.status === 'all' || run.status === filters.status) &&
      (run.name.toLowerCase().includes(query) || run.repository.toLowerCase().includes(query)),
  );

  return visibleRuns.sort((first, second): number => {
    const isDurationSort = filters.sort.startsWith('duration');

    if (
      isDurationSort &&
      first.durationSeconds === undefined &&
      second.durationSeconds !== undefined
    ) {
      return 1;
    }

    if (
      isDurationSort &&
      second.durationSeconds === undefined &&
      first.durationSeconds !== undefined
    ) {
      return -1;
    }

    const difference = isDurationSort
      ? (first.durationSeconds ?? 0) - (second.durationSeconds ?? 0)
      : Date.parse(first.createdAt) - Date.parse(second.createdAt);
    const direction = filters.sort.endsWith('asc') ? 1 : -1;

    return difference * direction || first.id.localeCompare(second.id);
  });
}

/** Отображает известную длительность, включая ноль; отсутствие обозначает тире. */
export function formatDuration(seconds?: number): string {
  if (seconds === undefined) {
    return '—';
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return minutes ? `${minutes} мин ${remainder} с` : `${remainder} с`;
}

/** Форматирует дату запуска в локальном часовом поясе пользователя. */
export function formatRunDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

import { describe, expect, it } from 'vitest';
import { runsMock } from '../../../api/modules/dashboard/mocks';
import { defaultFilters } from '../constants';
import { formatDuration, getFiltersFromUrl, getFiltersUrl, getVisibleRuns } from './index';

describe('поиск, фильтрация и сортировка запусков', (): void => {
  it('фильтрует по статусу', (): void => {
    const runs = getVisibleRuns(runsMock, { ...defaultFilters, status: 'running' });
    expect(runs).toHaveLength(2);
    expect(runs.every((run) => run.status === 'running')).toBe(true);
  });

  it('ищет по названию без учёта регистра и крайних пробелов', (): void => {
    expect(
      getVisibleRuns(runsMock, { ...defaultFilters, query: '  АВТОРИЗАЦИИ  ' }).map(
        (run) => run.id,
      ),
    ).toEqual(['run-008']);
  });

  it('совмещает поиск по репозиторию и статус', (): void => {
    expect(
      getVisibleRuns(runsMock, { ...defaultFilters, query: 'WEB', status: 'succeeded' }).map(
        (run) => run.id,
      ),
    ).toEqual(['run-003']);
  });

  it('возвращает пустой результат, если условия не совпадают', (): void => {
    expect(
      getVisibleRuns(runsMock, { ...defaultFilters, query: 'payments', status: 'failed' }),
    ).toEqual([]);
  });

  it('сортирует по дате в обоих направлениях, не изменяя исходный массив', (): void => {
    const snapshot = structuredClone(runsMock);
    expect(getVisibleRuns(runsMock, defaultFilters)[0].id).toBe('run-008');
    expect(getVisibleRuns(runsMock, { ...defaultFilters, sort: 'created-asc' })[0].id).toBe(
      'run-001',
    );
    expect(runsMock).toEqual(snapshot);
  });

  it('сортирует по длительности, ноль учитывает, неизвестные значения оставляет в конце', (): void => {
    const ascending = getVisibleRuns(runsMock, { ...defaultFilters, sort: 'duration-asc' });
    const descending = getVisibleRuns(runsMock, { ...defaultFilters, sort: 'duration-desc' });
    expect(ascending[0].durationSeconds).toBe(0);
    expect(descending[0].durationSeconds).toBe(312);
    expect(ascending.slice(-3).every((run) => run.durationSeconds === undefined)).toBe(true);
    expect(descending.slice(-3).every((run) => run.durationSeconds === undefined)).toBe(true);
  });

  it('одинаковые значения упорядочивает по id', (): void => {
    const runs = [
      { ...runsMock[0], id: 'b' },
      { ...runsMock[0], id: 'a' },
    ];
    expect(getVisibleRuns(runs, defaultFilters).map((run) => run.id)).toEqual(['a', 'b']);
  });
});

describe('URL условий', (): void => {
  it('восстанавливает все условия из ссылки', (): void => {
    expect(getFiltersFromUrl('?status=failed&q=api&sort=duration-asc')).toEqual({
      status: 'failed',
      query: 'api',
      sort: 'duration-asc',
    });
  });

  it('подставляет defaults для неизвестных значений', (): void => {
    expect(getFiltersFromUrl('?status=unknown&sort=invalid')).toEqual(defaultFilters);
  });

  it('сохраняет сторонние параметры и hash, корректно кодирует поиск', (): void => {
    const result = getFiltersUrl('https://example.com/?ref=review#main', {
      status: 'running',
      query: 'тест & web',
      sort: 'duration-desc',
    });
    const url = new URL(result, 'https://example.com');
    expect(url.searchParams.get('q')).toBe('тест & web');
    expect(url.searchParams.get('ref')).toBe('review');
    expect(url.hash).toBe('#main');
    expect(getFiltersFromUrl(url.search)).toEqual({
      status: 'running',
      query: 'тест & web',
      sort: 'duration-desc',
    });
  });

  it('не сохраняет значения по умолчанию', (): void => {
    expect(
      getFiltersUrl(
        'https://example.com/?status=failed&q=api&sort=duration-asc&ref=test',
        defaultFilters,
      ),
    ).toBe('/?ref=test');
  });
});

it('форматирует нулевую, отсутствующую и минутную длительность', (): void => {
  expect(formatDuration(0)).toBe('0 с');
  expect(formatDuration()).toBe('—');
  expect(formatDuration(147)).toBe('2 мин 27 с');
});

import { afterEach, beforeEach, expect, it, vi } from 'vitest';

beforeEach((): void => {
  vi.useFakeTimers();
  vi.resetModules();
  vi.stubEnv('VITE_MOCK_FAIL_ONCE', 'false');
});

afterEach((): void => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

it('возвращает независимые копии данных после задержки', async (): Promise<void> => {
  const { getRuns } = await import('./index');
  const firstRequest = getRuns();
  await vi.runAllTimersAsync();
  const first = await firstRequest;
  first[0].logs.push('изменение');
  const secondRequest = getRuns();
  await vi.runAllTimersAsync();
  const second = await secondRequest;
  expect(second.length).toBeGreaterThanOrEqual(6);
  expect(new Set(second.map((run) => run.status)).size).toBe(4);
  expect(second[0].logs).not.toContain('изменение');
});

it('параллельные запросы сохраняют тестовый отказ в StrictMode', async (): Promise<void> => {
  vi.stubEnv('VITE_MOCK_FAIL_ONCE', 'true');
  const { getRuns } = await import('./index');
  const first = expect(getRuns()).rejects.toThrow('Не удалось получить запуски');
  const second = expect(getRuns()).rejects.toThrow('Не удалось получить запуски');
  await vi.runAllTimersAsync();
  await Promise.all([first, second]);
});

it('после тестового отказа повторный запрос успешен', async (): Promise<void> => {
  vi.stubEnv('VITE_MOCK_FAIL_ONCE', 'true');
  const { getRuns } = await import('./index');
  const failed = getRuns();
  const failureAssertion = expect(failed).rejects.toThrow('Не удалось получить запуски');
  await vi.runAllTimersAsync();
  await failureAssertion;
  const retry = getRuns();
  await vi.runAllTimersAsync();
  expect(await retry).not.toHaveLength(0);
});

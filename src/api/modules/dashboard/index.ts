import type { IRun } from './interfaces';
import { runsMock } from './mocks';

let isFailurePending = import.meta.env.VITE_MOCK_FAIL_ONCE === 'true';

/** Возвращает локальные запуски с задержкой и поддерживает тестовый отказ. */
export function getRuns(): Promise<IRun[]> {
  const shouldFail = isFailurePending;

  return new Promise((resolve, reject): void => {
    setTimeout((): void => {
      if (shouldFail) {
        isFailurePending = false;
        reject(new Error('Не удалось получить запуски'));
        return;
      }

      resolve(runsMock.map((run) => ({ ...run, logs: [...run.logs] })));
    }, 2000);
  });
}

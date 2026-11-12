import { StrictMode } from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getRuns } from '../../api/modules/dashboard';
import { runsMock } from '../../api/modules/dashboard/mocks';
import { Dashboard } from './index';

vi.mock('../../api/modules/dashboard', () => ({ getRuns: vi.fn() }));

beforeEach((): void => {
  window.history.replaceState(null, '', '/');
  vi.mocked(getRuns).mockResolvedValue(runsMock);
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement): void {
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function (this: HTMLDialogElement): void {
      this.removeAttribute('open');
    },
  });
});

describe('dashboard', (): void => {
  it('показывает загрузку, затем запуски', async (): Promise<void> => {
    render(<Dashboard />);
    expect(screen.getByText('Получаем запуски…')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: 'Рефакторинг авторизации' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Показано 8 из 8 запусков')).toBeInTheDocument();
  });

  it('фильтрует запуски и сохраняет статус в URL', async (): Promise<void> => {
    const user = userEvent.setup();
    render(<Dashboard />);
    await screen.findByRole('button', { name: 'Рефакторинг авторизации' });
    await user.click(screen.getByRole('button', { name: 'Running 2' }));
    expect(screen.getByText('Показано 2 из 8 запусков')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Исправить тесты оплаты' }),
    ).not.toBeInTheDocument();
    expect(new URLSearchParams(location.search).get('status')).toBe('running');
  });

  it('ищет по репозиторию совместно с фильтром', async (): Promise<void> => {
    const user = userEvent.setup();
    render(<Dashboard />);
    await screen.findByRole('button', { name: 'Рефакторинг авторизации' });
    await user.click(screen.getByRole('button', { name: 'Succeeded 4' }));
    await user.type(screen.getByRole('searchbox', { name: 'Поиск запусков' }), 'WEB');
    expect(screen.getByText('Показано 1 из 8 запусков')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Проверить доступность интерфейса' }),
    ).toBeInTheDocument();
    expect(new URLSearchParams(location.search).get('q')).toBe('WEB');
  });

  it('открывает детали с логами и результатом, закрывает и возвращает фокус', async (): Promise<void> => {
    const user = userEvent.setup();
    render(<Dashboard />);
    const trigger = await screen.findByRole('button', { name: 'Исправить тесты оплаты' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Все 24 теста прошли/)).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Результат' })).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Вернуться к списку' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('показывает детали без необязательных значений и закрывает по cancel', async (): Promise<void> => {
    const user = userEvent.setup();
    render(<Dashboard />);
    await user.click(await screen.findByRole('button', { name: 'Рефакторинг авторизации' }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('—')).toBeInTheDocument();
    expect(within(dialog).queryByRole('heading', { name: 'Результат' })).not.toBeInTheDocument();
    act((): void => {
      dialog.dispatchEvent(new Event('cancel', { bubbles: true }));
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('показывает пустое состояние и сбрасывает условия', async (): Promise<void> => {
    const user = userEvent.setup();
    render(<Dashboard />);
    await screen.findByRole('button', { name: 'Рефакторинг авторизации' });
    await user.type(screen.getByRole('searchbox'), 'несуществующий запуск');
    expect(screen.getByRole('heading', { name: 'Ничего не нашлось' })).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Сбросить фильтры' })[0]);
    expect(screen.getByText('Показано 8 из 8 запусков')).toBeInTheDocument();
    expect(location.search).toBe('');
  });

  it('показывает ошибку и повторяет запрос', async (): Promise<void> => {
    vi.mocked(getRuns).mockRejectedValueOnce(new Error('offline'));
    const user = userEvent.setup();
    render(<Dashboard />);
    expect(
      await screen.findByRole('heading', { name: 'Не удалось получить запуски' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Повторить' }));
    expect(
      await screen.findByRole('button', { name: 'Рефакторинг авторизации' }),
    ).toBeInTheDocument();
  });

  it('восстанавливает условия из URL и реагирует на popstate', async (): Promise<void> => {
    window.history.replaceState(null, '', '/?status=failed&q=api&sort=duration-asc');
    render(<Dashboard />);
    expect(
      await screen.findByRole('button', { name: 'Миграция схемы уведомлений' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('api');
    expect(screen.getByRole('combobox')).toHaveValue('duration-asc');
    act((): void => {
      window.history.replaceState(null, '', '/?status=queued');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByRole('button', { name: 'Обновить зависимости' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('меняет порядок и записывает сортировку в URL', async (): Promise<void> => {
    const user = userEvent.setup();
    render(<Dashboard />);
    await screen.findByRole('button', { name: 'Рефакторинг авторизации' });
    await user.selectOptions(screen.getByRole('combobox'), 'duration-asc');
    const rows = within(screen.getByRole('table')).getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Проверить конфигурацию окружения');
    expect(location.search).toContain('sort=duration-asc');
  });

  it('игнорирует поздний ответ неактивного эффекта в StrictMode', async (): Promise<void> => {
    vi.mocked(getRuns).mockImplementationOnce(
      () =>
        new Promise((resolve): void => {
          setTimeout((): void => resolve([]), 30);
        }),
    );
    render(
      <StrictMode>
        <Dashboard />
      </StrictMode>,
    );
    expect(
      await screen.findByRole('button', { name: 'Рефакторинг авторизации' }),
    ).toBeInTheDocument();
    await act(async (): Promise<void> => {
      await new Promise((resolve): void => {
        setTimeout(resolve, 50);
      });
    });
    expect(screen.getByText('Показано 8 из 8 запусков')).toBeInTheDocument();
  });
});

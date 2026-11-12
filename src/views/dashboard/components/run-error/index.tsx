import type { ReactElement } from 'react';
import { Button } from '../../../../components/shared/button';
import { FeedbackState } from '../../../../components/composite/feedback-state';
import { Icon } from '../../../../components/shared/icon';

interface IRunErrorProps {
  onRetry: () => void;
}

export function RunError({ onRetry }: IRunErrorProps): ReactElement {
  return (
    <FeedbackState
      icon="refresh"
      title="Не удалось получить запуски"
      description="Данные временно недоступны. Попробуйте ещё раз."
    >
      <Button onClick={onRetry}>
        <Icon name="refresh" size={15} />
        Повторить
      </Button>
    </FeedbackState>
  );
}

import type { ReactElement } from 'react';
import { Button } from '../../../../components/shared/button';
import { FeedbackState } from '../../../../components/composite/feedback-state';

interface IRunEmptyProps {
  onReset: () => void;
}

export function RunEmpty({ onReset }: IRunEmptyProps): ReactElement {
  return (
    <FeedbackState
      icon="search"
      title="Ничего не нашлось"
      description="Попробуйте другое название или сбросьте поиск и фильтры."
    >
      <Button variant="secondary" onClick={onReset}>
        Сбросить фильтры
      </Button>
    </FeedbackState>
  );
}

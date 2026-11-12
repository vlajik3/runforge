import type { ComponentProps } from 'react';
import type { Button } from '../../../shared/button';

export interface IModalButton extends Omit<ComponentProps<typeof Button>, 'children'> {
  text: string;
}

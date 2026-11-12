import type { ButtonHTMLAttributes, ReactElement } from 'react';
import classNames from 'classnames';
import styles from './button.module.scss';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  isActive?: boolean;
  isIconOnly?: boolean;
}

export function Button({
  variant = 'primary',
  isActive = false,
  isIconOnly = false,
  className,
  type = 'button',
  ...props
}: IButtonProps): ReactElement {
  return (
    <button
      type={type}
      className={classNames(styles.button, styles[`button--${variant}`], className, {
        [styles['button--active']]: isActive,
        [styles['button--icon-only']]: isIconOnly,
      })}
      {...props}
    />
  );
}

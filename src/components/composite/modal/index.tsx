import { useEffect, useRef } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Button } from '../../shared/button';
import { Icon } from '../../shared/icon';
import type { IModalButton } from './interfaces';
import styles from './modal.module.scss';

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerText: string;
  footerText: string;
  buttons: IModalButton[];
  children: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  headerText,
  footerText,
  buttons,
  children,
}: IModalProps): ReactElement {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();

    return (): void => {
      dialog?.close();

      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      onCancel={(event): void => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className={styles.modal__header}>
        <span className={styles.modal__heading}>{headerText}</span>
        <Button variant="ghost" isIconOnly onClick={onClose}>
          <Icon name="cross" size={20} />
        </Button>
      </div>
      <div className={styles.modal__body}>{children}</div>
      <div className={styles.modal__footer}>
        <span className={styles.modal__caption}>{footerText}</span>
        <div className={styles.modal__actions}>
          {buttons.map(({ text, ...buttonProps }) => (
            <Button key={text} {...buttonProps}>
              {text}
            </Button>
          ))}
        </div>
      </div>
    </dialog>
  );
}

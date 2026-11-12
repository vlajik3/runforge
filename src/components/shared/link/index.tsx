import type { AnchorHTMLAttributes, ReactElement } from 'react';
import classNames from 'classnames';
import styles from './link.module.scss';

interface ILinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export function Link({ className, ...props }: ILinkProps): ReactElement {
  return <a className={classNames(styles.link, className)} {...props} />;
}

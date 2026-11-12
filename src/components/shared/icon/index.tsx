import type { ReactElement } from 'react';

import type { IIconName } from './interfaces';

interface IIconProps {
  name: IIconName;
  size?: number;
  className?: string;
}

const paths: Record<IIconName, string> = {
  runs: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
  search: 'M15.5 15.5 21 21 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  branch:
    'M6 3v12a4 4 0 0 0 4 4h5 M6 7h8a4 4 0 0 0 4-4 M8 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M20 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
  repository: 'M5 3h14v18l-7-4-7 4z M9 7h6',
  clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 7v5l3 2',
  activity: 'M3 12h4l3-7 4 14 3-7h4',
  check: 'M5 12l4 4L19 6',
  cross: 'M6 6l12 12 M18 6 6 18',
  refresh: 'M20 10a8 8 0 1 0-1 8 M20 3v7h-7',
  terminal: 'M4 5h16v14H4z M7 9l3 3-3 3 M13 15h4',
  cloud: 'M7 18h11a4 4 0 0 0 .2-8 6 6 0 0 0-11.6-1A4.5 4.5 0 0 0 7 18Z',
};

export function Icon({ name, size = 18, className }: IIconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}

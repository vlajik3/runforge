import type { ReactElement } from 'react';
import { AppLayout } from './components/layout/app-layout';
import { Dashboard } from './views/dashboard';

export function App(): ReactElement {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}

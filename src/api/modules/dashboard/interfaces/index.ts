export type IRunStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export interface IRun {
  id: string;
  name: string;
  repository: string;
  branch: string;
  status: IRunStatus;
  createdAt: string;
  durationSeconds?: number;
  logs: string[];
  result?: string;
}

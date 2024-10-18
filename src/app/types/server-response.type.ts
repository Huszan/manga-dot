import { Status } from './status.type';

export type ServerResponse = {
  status: Status;
  message?: string;
  data?: any;
};

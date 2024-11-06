import { ConfirmDialogData } from '../components/global/confirm-dialog/confirm-dialog.component';

export interface ActionButton {
  name?: string;
  icon?: string;
  color?: 'primary' | 'accent' | 'warn';
  isActive: boolean;
  confirmData?: ConfirmDialogData;
  action: () => void;
}

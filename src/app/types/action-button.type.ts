export interface ActionButton {
  name?: string;
  icon?: string;
  color?: 'primary' | 'accent' | 'warn';
  isActive: boolean;
  action: () => void;
}

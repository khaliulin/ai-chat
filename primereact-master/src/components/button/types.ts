import { ButtonProps as PrimeButtonProps } from 'primereact/button';

export interface ButtonProps extends Omit<PrimeButtonProps, 'severity' | 'size'> {
  severity?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'warning' | 'success' | 'info';
  size?: PrimeButtonProps['size'] | 'base' | 'xLarge';
  dataTest?: string;
}

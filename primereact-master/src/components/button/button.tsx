import { Button as PrimeButton, ButtonProps as PrimeButtonProps } from 'primereact/button';
import { ButtonProps } from './types';

export const Button = (props: ButtonProps) => {
  const { severity, size, dataTest, className, ...restProps } = props;

  const severityMap: Record<string, PrimeButtonProps['severity']> = {
    primary: undefined,
    secondary: 'secondary',
    tertiary: 'help',
    danger: 'danger',
    warning: 'warning',
    success: 'success',
    info: 'info',
  };

  const sizeMap = { base: undefined, xLarge: 'large' } as const;
  const classMap = { xLarge: 'p-button-xl' } as const;

  const primeSeverity = severity ? severityMap[severity] : undefined;
  const primeSize = size && size in sizeMap ? sizeMap[size as keyof typeof sizeMap] : (size as 'small' | 'large' | undefined);
  const extraClass = size && size in classMap ? classMap[size as keyof typeof classMap] : undefined;

  return (
    <PrimeButton
      severity={primeSeverity}
      size={primeSize}
      className={[extraClass, className].filter(Boolean).join(' ') || undefined}
      data-test={dataTest}
      {...restProps}
    />
  );
};

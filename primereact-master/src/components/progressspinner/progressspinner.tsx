import { ProgressSpinner as PrimeProgressSpinner } from 'primereact/progressspinner';
import { ProgressSpinnerProps } from './types';
import { useMemo } from 'react';

export const ProgressSpinner = (props: ProgressSpinnerProps) => {
  const { size, className, ...restProps } = props;

  const classNames = useMemo(() => {
    const classes = [size && `p-progress-spinner-${size}`, className].filter(
      Boolean
    );

    return classes.length > 0 ? classes.join(' ') : undefined;
  }, [size, className]);

  return <PrimeProgressSpinner className={classNames} {...restProps} />;
};

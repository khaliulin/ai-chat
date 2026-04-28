import { InputText as PrimeInputText } from 'primereact/inputtext';
import { InputTextProps } from './types';

export const InputText = (props: InputTextProps) => {
  const { ...rest } = props;

  return <PrimeInputText {...rest} />;
};

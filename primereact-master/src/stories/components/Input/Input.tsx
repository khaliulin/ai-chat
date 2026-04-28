import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import React, { useState } from 'react';

export interface InputProps {
  label: string;
  isLoading?: boolean;
  showClearButton?: boolean;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  isLoading,
  showClearButton,
  error,
}) => {
  const [value, setValue] = useState<string>('');

  const onClear = () => {
    setValue('');
  };

  return (
    <div
      style={{
        position: 'relative',
        margin: '1rem',
        width: '20rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <FloatLabel>
        <InputText
          id="input"
          value={value}
          onChange={e => setValue(e.target.value)}
          invalid={!!error}
          style={{
            width: '100%',
            paddingRight:
              isLoading || (showClearButton && value) ? '2rem' : undefined,
          }}
        />
        <label htmlFor="input">{label}</label>
        {isLoading && (
          <i
            className="pi pi-spinner pi-spin"
            style={{
              position: 'absolute',
              right: showClearButton && value ? '2rem' : '0.5rem',
              top: 'calc(50% - 0.5rem)',
            }}
          />
        )}
        {showClearButton && value && (
          <i
            className="pi pi-times"
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
            }}
            onClick={onClear}
          />
        )}
      </FloatLabel>
      {error && <small className="p-error">{error}</small>}
    </div>
  );
};

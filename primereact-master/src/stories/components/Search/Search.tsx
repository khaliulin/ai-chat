import * as React from 'react';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

export interface SearchProps {
  onClose?: () => void;
}

export const Search: React.FC<SearchProps> = () => {
  return (
    <div className="px-6 flex items-center gap-4">
      <div className="grow">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            placeholder="Найти посылку или товар"
            className="w-full"
            autoFocus
          />
        </IconField>
      </div>
    </div>
  );
};

import React, { useRef } from 'react';
import { TieredMenu } from 'primereact/tieredmenu';
import { Button } from 'primereact/button';

export default {
  title: 'Components/TieredMenu',
  component: TieredMenu,
};

const items = [
  {
    label: 'File',
    items: [
      {
        label: 'New',
        items: [
          { label: 'Document' },
          { label: 'Image' },
        ],
      },
      { label: 'Open' },
      { label: 'Quit' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo' },
      { label: 'Redo' },
    ],
  },
];

export const Basic = () => {
  const menu = useRef<any>(null);

  return (
    <div>
      <Button label="Show Menu" onClick={(event) => menu.current && menu.current.toggle(event)} />
      <TieredMenu model={items} popup ref={menu} />
    </div>
  );
}; 
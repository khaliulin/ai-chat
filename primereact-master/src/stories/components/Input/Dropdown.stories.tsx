import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Dropdown, DropdownProps } from 'primereact/dropdown';

export default {
  title: 'Components/Input/Dropdown',
  component: Dropdown,
} as Meta;

const Template: StoryFn<DropdownProps> = args => {
  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];

  return (
    <Dropdown
      {...args}
      value={selectedCity}
      onChange={e => setSelectedCity(e.value)}
      options={cities}
      optionLabel="name"
      placeholder="Select a City"
    />
  );
};

export const Default = Template.bind({});
Default.args = {};

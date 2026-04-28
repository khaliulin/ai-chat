import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { ListBox, ListBoxProps } from 'primereact/listbox';

export default {
  title: 'Components/Input/ListBox',
  component: ListBox,
} as Meta;

const Template: StoryFn<ListBoxProps> = (args) => {
    const [selectedCity, setSelectedCity] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    return (
        <ListBox {...args} value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name" />
    )
}
export const Default = Template.bind({});
Default.args = {}; 
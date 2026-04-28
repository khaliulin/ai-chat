import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { MultiSelect, MultiSelectProps } from 'primereact/multiselect';

export default {
  title: 'Components/Input/MultiSelect',
  component: MultiSelect,
} as Meta;

const Template: StoryFn<MultiSelectProps> = (args) => {
    const [selectedCities, setSelectedCities] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    return (
        <MultiSelect {...args} value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name" 
            placeholder="Select Cities" maxSelectedLabels={3} />
    )
}
export const Default = Template.bind({});
Default.args = {}; 
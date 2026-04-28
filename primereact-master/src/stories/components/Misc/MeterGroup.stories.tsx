import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { MeterGroup, MeterGroupProps } from 'primereact/metergroup';

export default {
    title: 'Components/Misc/MeterGroup',
    component: MeterGroup
} as Meta;

const Template: StoryFn<MeterGroupProps> = (args) => {
    return (
        <MeterGroup {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    values: [
        { label: 'Apps', value: 16, color: '#34d399' },
        { label: 'Messages', value: 8, color: '#fbbf24' },
        { label: 'Media', value: 24, color: '#60a5fa' },
        { label: 'System', value: 10, color: '#c084fc' }
    ]
}; 

import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Chip, ChipProps } from 'primereact/chip';

export default {
    title: 'Components/Misc/Chip',
    component: Chip
} as Meta;

const Template: StoryFn<ChipProps> = (args) => {
    return (
        <Chip {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    label: "Action"
}; 
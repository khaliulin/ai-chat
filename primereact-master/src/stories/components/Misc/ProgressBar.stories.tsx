import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { ProgressBar, ProgressBarProps } from 'primereact/progressbar';

export default {
    title: 'Components/Misc/ProgressBar',
    component: ProgressBar
} as Meta;

const Template: StoryFn<ProgressBarProps> = (args) => {
    return (
        <ProgressBar {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    value: 50
}; 
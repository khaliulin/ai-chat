import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Tooltip, TooltipProps } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';

export default {
    title: 'Components/Overlay/Tooltip',
    component: Tooltip
} as Meta;

const Template: StoryFn<TooltipProps> = (args) => {
    return (
        <div>
            <Tooltip {...args} />
            <InputText className="p-d-block p-mb-2" placeholder="Hover me" data-pr-tooltip="This is a tooltip" />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {}; 
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { ToggleButton, ToggleButtonProps } from 'primereact/togglebutton';

export default {
  title: 'Components/Input/ToggleButton',
  component: ToggleButton,
} as Meta;

const Template: StoryFn<ToggleButtonProps> = (args) => {
    const [checked, setChecked] = useState(false);

    return (
        <ToggleButton {...args} checked={checked} onChange={(e) => setChecked(e.value)} />
    )
}
export const Default = Template.bind({});
Default.args = {
    onLabel: "On",
    offLabel: "Off"
}; 
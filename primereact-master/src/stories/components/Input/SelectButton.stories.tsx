import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { SelectButton, SelectButtonProps } from 'primereact/selectbutton';

export default {
  title: 'Components/Input/SelectButton',
  component: SelectButton,
} as Meta;

const Template: StoryFn<SelectButtonProps> = (args) => {
    const [value, setValue] = useState('Off');
    const options = ['Off', 'On'];

    return (
        <SelectButton {...args} value={value} onChange={(e) => setValue(e.value)} options={options} />
    )
}
export const Default = Template.bind({});
Default.args = {}; 
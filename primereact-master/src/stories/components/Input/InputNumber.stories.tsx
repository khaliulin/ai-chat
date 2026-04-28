import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { InputNumber, InputNumberProps } from 'primereact/inputnumber';

export default {
  title: 'Components/Input/InputNumber',
  component: InputNumber,
} as Meta;

const Template: StoryFn<InputNumberProps> = (args) => {
    const [value, setValue] = useState<number | null>(null);

    return (
        <InputNumber {...args} value={value} onValueChange={(e) => setValue(e.value ?? null)} />
    )
}
export const Default = Template.bind({});
Default.args = {
    placeholder: 'Enter a number'
}; 
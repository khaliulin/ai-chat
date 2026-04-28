import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { InputOtp, InputOtpProps } from 'primereact/inputotp';

export default {
  title: 'Components/Input/InputOtp',
  component: InputOtp,
} as Meta;

const Template: StoryFn<InputOtpProps> = (args) => {
    const [value, setValue] = useState('');

    return (
        <InputOtp {...args} value={value} onChange={(e) => setValue(String(e.value || ''))} />
    )
}
export const Default = Template.bind({});
Default.args = {
  length: 6,
}; 
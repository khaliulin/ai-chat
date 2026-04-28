import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { InputSwitch, InputSwitchProps } from 'primereact/inputswitch';

export default {
  title: 'Components/Input/InputSwitch',
  component: InputSwitch,
} as Meta;

const Template: StoryFn<InputSwitchProps> = (args) => {
    const [checked, setChecked] = useState(false);

    return (
        <InputSwitch {...args} checked={checked} onChange={(e) => setChecked(e.value)} />
    )
}
export const Default = Template.bind({});
Default.args = {}; 
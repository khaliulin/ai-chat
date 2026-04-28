import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { InputText } from 'primereact/inputtext';
import { InputTextProps } from 'primereact/inputtext';

export default {
  title: 'Components/Input/InputText',
  component: InputText,
} as Meta;

const Template: StoryFn<InputTextProps> = (args) => {
    return (
        <InputText {...args} />
    )
}
export const Default = Template.bind({});
Default.args = {
  placeholder: 'Placeholder',
}; 
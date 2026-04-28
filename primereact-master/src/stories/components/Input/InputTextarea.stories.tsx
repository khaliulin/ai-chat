import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputTextareaProps } from 'primereact/inputtextarea';

export default {
  title: 'Components/Input/InputTextarea',
  component: InputTextarea,
} as Meta;

const Template: StoryFn<InputTextareaProps> = (args) => {
    return (
        <InputTextarea {...args} />
    )
}
export const Default = Template.bind({});
Default.args = {
  placeholder: 'Your message',
  rows: 5,
  cols: 30,
}; 
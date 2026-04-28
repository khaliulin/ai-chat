import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Chips, ChipsProps } from 'primereact/chips';

export default {
  title: 'Components/Input/Chips',
  component: Chips,
} as Meta;

const Template: StoryFn<ChipsProps> = (args) => {
    const [value, setValue] = useState<string[]>([]);

    return (
        <Chips {...args} value={value} onChange={(e) => setValue(e.value || [])} />
    )
}
export const Default = Template.bind({});
Default.args = {}; 
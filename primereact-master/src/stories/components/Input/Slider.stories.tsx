import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Slider, SliderProps } from 'primereact/slider';

export default {
  title: 'Components/Input/Slider',
  component: Slider,
} as Meta;

const Template: StoryFn<SliderProps> = (args) => {
    const [value, setValue] = useState(50);

    return (
        <Slider {...args} value={value} onChange={(e) => setValue(Array.isArray(e.value) ? e.value[0] : e.value)} />
    )
}
export const Default = Template.bind({});
Default.args = {}; 
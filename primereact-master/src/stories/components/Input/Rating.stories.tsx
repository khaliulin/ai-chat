import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Rating, RatingProps } from 'primereact/rating';

export default {
  title: 'Components/Input/Rating',
  component: Rating,
} as Meta;

const Template: StoryFn<RatingProps> = (args) => {
    const [value, setValue] = useState<number | undefined>(undefined);

    return (
        <Rating {...args} value={value} onChange={(e) => setValue(e.value || undefined)} />
    )
}
export const Default = Template.bind({});
Default.args = {}; 
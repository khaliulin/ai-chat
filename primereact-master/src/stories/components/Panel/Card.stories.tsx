import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Card } from 'primereact/card';
import { CardProps } from 'primereact/card';

export default {
  title: 'Components/Panel/Card',
  component: Card,
} as Meta;

const Template: StoryFn<CardProps> = (args) => {
    return (
        <Card {...args}>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p>
        </Card>
    )
}
export const Default = Template.bind({});
Default.args = {
  title: 'Simple Card',
}; 
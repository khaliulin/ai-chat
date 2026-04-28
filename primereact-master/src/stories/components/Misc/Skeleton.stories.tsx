import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Skeleton, SkeletonProps } from 'primereact/skeleton';

export default {
    title: 'Components/Misc/Skeleton',
    component: Skeleton
} as Meta;

const Template: StoryFn<SkeletonProps> = (args) => {
    return (
        <Skeleton {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    width: '10rem',
    height: '4rem'
}; 
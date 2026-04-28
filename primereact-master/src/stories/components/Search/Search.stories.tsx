import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Search, SearchProps } from './Search';

export default {
  title: 'Components/Search',
  component: Search,
  argTypes: {
    onClose: { action: 'clicked' },
  },
} as Meta;

const Template: StoryFn<SearchProps> = (args: SearchProps) => (
  <Search {...args} />
);

export const BasicSearch = Template.bind({});

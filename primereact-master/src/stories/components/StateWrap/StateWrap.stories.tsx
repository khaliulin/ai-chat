import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import StateWrap, { StateWrapProps } from './StateWrap';

export default {
  title: 'Components/StateWrap',
  component: StateWrap,
} as Meta;

const Template: StoryFn<StateWrapProps> = (args) => <StateWrap {...args} />;

export const LoadingState = Template.bind({});
LoadingState.args = {
  isLoaded: false,
  isLoading: true,
  loadingContent: <div>Loading...</div>,
  children: <div>Content loaded!</div>,
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  isLoaded: false,
  isLoading: false,
  error: new Error('Something went wrong'),
  errorContent: <div>Error: Unable to load content.</div>,
  children: <div>Content loaded!</div>,
};

export const LoadedState = Template.bind({});
LoadedState.args = {
  isLoaded: true,
  isLoading: false,
  children: <div>Content loaded successfully!</div>,
};

export const EmptyState = Template.bind({});
EmptyState.args = {
  isLoaded: false,
  isLoading: false,
  children: <div>Content loaded successfully!</div>,
};

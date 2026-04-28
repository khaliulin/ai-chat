import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Input, InputProps } from './Input'

// import '../../../themes/lara/lara-light/green/theme.scss';
// import 'primeicons/primeicons.css';

export default {
  title: 'Components/Input',
  component: Input,
} as Meta;

const Template: StoryFn<InputProps> = (args) => <Input {...args} />;

export const FloatLabelWithLoadingAndClear = Template.bind({});
FloatLabelWithLoadingAndClear.args = {
  label: "Username",
  isLoading: true,
  showClearButton: true
}

export const FloatLabelWithError = Template.bind({});
FloatLabelWithError.args = {
  label: "Email",
  error: "Invalid email address"
}

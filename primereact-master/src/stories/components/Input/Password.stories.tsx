import * as React from 'react';
import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Password, PasswordProps } from 'primereact/password';

export default {
  title: 'Components/Input/Password',
  component: Password,
} as Meta;

const Template: StoryFn<PasswordProps> = (args) => {
  const [value, setValue] = useState('');
  return (
    <Password
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  value: '',
  onChange: () => {},
  placeholder: 'Введите пароль',
  disabled: false,
  feedback: false,
  toggleMask: true,
  promptLabel: 'Введите пароль',
  weakLabel: 'Слабый',
  mediumLabel: 'Средний',
  strongLabel: 'Сильный',
  header: <div>Заголовок пароля</div>,
  footer: <div>Футер пароля</div>,
  tabIndex: 0,
  inputStyle: { backgroundColor: '#fff' },
  inputClassName: 'custom-input',
  style: { width: 300 },
  className: 'custom-password',
  tooltip: 'Пароль должен быть сложным',
  tooltipOptions: { position: 'top' },
  icon: null,
  id: 'default-password',
  name: 'password',
  required: false,
  autoFocus: false,
  readOnly: false,
  maxLength: 32,
  minLength: 6,
  ariaLabel: 'Пароль',
  ariaDescribedBy: 'password-help',
};

export const WithFeedback = Template.bind({});
WithFeedback.args = {
  placeholder: 'Пароль с подсказкой',
  feedback: true,
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  placeholder: 'Пароль с кастомной иконкой',
  toggleMask: true,
  icon: 'pi pi-user',
};

export const Disabled = Template.bind({});
Disabled.args = {
  placeholder: 'Пароль (disabled)',
  disabled: true,
};

export const WithTooltip = () => {
  const [value, setValue] = useState('');
  return (
    <Password value={value} onChange={e => setValue(e.target.value)} placeholder="Пароль с tooltip" tooltip="Пароль должен быть сложным" />
  );
};

export const WithHeaderFooter = () => {
  const [value, setValue] = useState('');
  const header = <div>Введите сложный пароль</div>;
  const footer = <div>Используйте буквы, цифры и спецсимволы</div>;
  return (
    <Password value={value} onChange={e => setValue(e.target.value)} placeholder="Пароль с header/footer" header={header} footer={footer} feedback={true} />
  );
};

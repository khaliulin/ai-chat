import { useRef } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Toast, ToastProps } from 'primereact/toast';
import { Button } from 'primereact/button';

export default {
  title: 'Components/Messages/Toast',
  component: Toast,
} as Meta;

const Template: StoryFn<ToastProps> = args => {
  const toast = useRef<Toast>(null);

  const show = () => {
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
    });
  };

  return (
    <div>
      <Toast {...args} ref={toast} />
      <Button onClick={show} label="Show" />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};

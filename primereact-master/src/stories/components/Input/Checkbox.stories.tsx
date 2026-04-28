import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Checkbox, CheckboxProps } from 'primereact/checkbox';

export default {
  title: 'Components/Input/Checkbox',
  component: Checkbox,
} as Meta;

const Template: StoryFn<CheckboxProps> = args => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex align-items-center">
        <Checkbox
          {...args}
          inputId="c1"
          checked={checked}
          onChange={e => setChecked(!!e.checked)}
        />
        <label htmlFor="c1" className="ml-2">
          Сheckbox can be changed
        </label>
      </div>
      <div className="flex align-items-center">
        <Checkbox {...args} inputId="c2" checked={true} />
        <label htmlFor="c2" className="ml-2">
          Checkbox checked: true
        </label>
      </div>
      <div className="flex align-items-center">
        <Checkbox {...args} inputId="c3" checked={false} />
        <label htmlFor="c3" className="ml-2">
          Checkbox checked: false
        </label>
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};

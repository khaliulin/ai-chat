import { Meta, StoryObj } from '@storybook/react';
import { IconAddressBook } from '@tabler/icons-react';

import { Button, type ButtonProps } from '../../../index.ts';
import { Group } from '../../common/Group.tsx';

const meta = {
  title: 'Components/Button',
  component: Button,
  // tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    severity: {
      control: 'select',
      options: [
        undefined,
        'primary',
        'secondary',
        'tertiary',
        'danger',
        'warning',
        'success',
        'info',
      ],
    },
    size: {
      control: 'select',
      options: [undefined, 'small', 'base', 'large', 'xLarge'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    outlined: { control: 'boolean' },
    text: { control: 'boolean' },
    rounded: { control: 'boolean' },
    link: { control: 'boolean' },

    icon: {
      control: {
        type: 'select',
        labels: {
          undefined: 'нет иконки',
          customIcon: 'Своя иконка, переданная в props icon',
        },
      },
      options: [undefined, 'customIcon'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

const severities: ButtonProps['severity'][] = [
  undefined,
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'warning',
  'success',
  'info',
];

const sizes: ButtonProps['size'][] = ['small', 'base', 'large', 'xLarge'];

function label(severity: ButtonProps['severity']) {
  return severity ?? 'default';
}

export const Default: Story = {
  args: { label: 'Button' },
  render: (args: ButtonProps) => (
    <Button
      {...args}
      icon={
        args.icon === 'customIcon' ? (
          <IconAddressBook className="p-button-icon" />
        ) : undefined
      }
    />
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div>
      <Group title="Sizes" className="flex gap-4 items-center">
        {sizes.map(size => (
          <Button
            key={size ?? 'default'}
            label={size ?? 'default'}
            size={size}
          />
        ))}
      </Group>

      <Group title="Severities" className="flex flex-wrap gap-4">
        {severities.map(s => (
          <Button key={s ?? 'default'} label={label(s)} severity={s} />
        ))}
      </Group>

      <Group title="Outlined" className="flex flex-wrap gap-4">
        {severities.map(s => (
          <Button key={s ?? 'default'} label={label(s)} severity={s} outlined />
        ))}
      </Group>

      <Group title="Text" className="flex flex-wrap gap-4">
        {severities.map(s => (
          <Button key={s ?? 'default'} label={label(s)} severity={s} text />
        ))}
      </Group>

      <Group title="Link" className="flex flex-wrap gap-4">
        {severities.map(s => (
          <Button key={s ?? 'default'} label={label(s)} severity={s} link />
        ))}
      </Group>

      <Group title="Rounded" className="flex flex-wrap gap-4">
        {severities.map(s => (
          <Button key={s ?? 'default'} label={label(s)} severity={s} rounded />
        ))}
      </Group>

      <Group title="With Icon Left" className="flex flex-wrap gap-4">
        {severities.map(s => (
          <Button
            key={s ?? 'default'}
            label={label(s)}
            severity={s}
            iconPos="left"
            icon={<IconAddressBook className="p-button-icon" />}
          />
        ))}
      </Group>

      <Group
        title="With Icon Right"
        className="flex flex-wrap gap-4"
        description={
          <span>
            Иконка должна иметь класс <code>.p-button-icon-right</code> для
            правильного позиционирования при использовании
          </span>
        }
      >
        {severities.map(s => (
          <Button
            key={s ?? 'default'}
            label={label(s)}
            severity={s}
            icon={
              <IconAddressBook className="p-button-icon p-button-icon-right" />
            }
            iconPos="right"
          />
        ))}
      </Group>

      <Group
        title="Icon Only"
        className="flex flex-wrap gap-4 items-center"
        description={
          <span>
            Иконка должна иметь класс <code>.p-button-icon</code> для
            правильного размера и отступов
          </span>
        }
      >
        {sizes.map(size => (
          <Button
            key={size ?? 'default'}
            size={size}
            icon={<IconAddressBook className="p-button-icon" />}
          />
        ))}
      </Group>

      <Group title="Disabled" className="flex flex-wrap gap-4">
        {severities.map(s => (
          <Button key={s ?? 'default'} label={label(s)} severity={s} disabled />
        ))}
      </Group>

      <Group title="Loading" className="flex flex-wrap gap-4" last>
        {severities.map(s => (
          <Button key={s ?? 'default'} label={label(s)} severity={s} loading />
        ))}
      </Group>
    </div>
  ),
};

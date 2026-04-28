import { Meta, StoryObj } from '@storybook/react';
import { useArgs } from 'storybook/internal/preview-api';
import { Badge, BadgeProps } from 'primereact/badge';
import { Group } from '../../common/Group';

const meta = {
  title: 'Components/Misc/Badge',
  component: Badge,
  argTypes: {
    value: { control: 'text' },
    severity: {
      control: { type: 'select' },
      options: [
        'success',
        'info',
        'warning',
        'danger',
        'secondary',
        // 'contrast',
        undefined,
      ],
    },
    size: {
      control: 'select',
      options: [null, 'normal', 'large', 'xlarge'],
    },
    unstyled: { control: 'boolean' },
  },
  decorators: [
    Story => (
      <div style={{ margin: '3em' }}>
        <h2 className="title-h2 mb-4">Badge</h2>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

const severities: BadgeProps['severity'][] = [
  'success',
  'info',
  'warning',
  'danger',
  'secondary',
  // 'contrast',
  undefined,
];

export const Default: Story = {
  args: {
    severity: 'info',
    value: 'Badge Text',
    size: null,
    unstyled: false,
  },
  render: () => {
    const [{ value, severity, size, unstyled }] = useArgs();

    return (
      <div>
        <Group title="Default">
          <Badge value="Default" />
        </Group>
        <Group title="Default without value prop (dot style)">
          <Badge />
        </Group>
        <Group title="Severities" className="flex gap-4">
          {severities.map(severity => (
            <Badge
              key={severity}
              severity={severity == undefined ? undefined : severity}
              value={severity == undefined ? 'primary' : severity}
            />
          ))}
        </Group>
        <Group title="Dot style with severities (normal)" className="flex gap-4">
          {severities.map(severity => (
            <Badge key={!severity ? 'default' : severity} severity={severity} />
          ))}
        </Group>
        <Group
          title="Dot style with severities (xlarge)"
          className="flex gap-4"
        >
          {severities.map(severity => (
            <Badge
              key={!severity ? 'default' : severity}
              severity={severity}
              size="xlarge"
            />
          ))}
        </Group>
        <Group title="Interactive" last>
          <Badge
            value={value}
            severity={severity}
            size={size}
            unstyled={unstyled}
          />
        </Group>
      </div>
    );
  },
};

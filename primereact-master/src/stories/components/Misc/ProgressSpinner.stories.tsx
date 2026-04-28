import { Meta, StoryObj } from '@storybook/react';
import { Group } from '../../common/Group';
import {
  ProgressSpinner,
  ProgressSpinnerProps,
} from '../../../components/progressspinner';

const meta = {
  title: 'Components/Misc/ProgressSpinner',
  component: ProgressSpinner,
  decorators: [
    Story => (
      <div style={{ margin: '3em' }}>
        <h2 className="title-h2 mb-4">ProgressSpinner</h2>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressSpinner>;

export default meta;

type Story = StoryObj<typeof meta>;

const sizes: ProgressSpinnerProps['size'][] = ['sm', 'md', 'lg', 'xl'];

export const Default: Story = {
  render: () => {
    return (
      <div>
        <Group title="Default">
          <ProgressSpinner />
        </Group>
        <Group title="Sizes" className="flex gap-4">
          {sizes.map(size => (
            <div className="flex flex-col gap-4" key={size}>
              <span>{size}</span>
              <ProgressSpinner size={size} />
            </div>
          ))}
        </Group>
      </div>
    );
  },
};

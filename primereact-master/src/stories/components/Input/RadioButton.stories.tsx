import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'storybook/internal/preview-api';
import { RadioButton } from 'primereact/radiobutton';
import { Group } from '../../common/Group';

const meta = {
  title: 'Components/Input/RadioButton',
  component: RadioButton,
  parameters: {
    docs: {
      toc: true,
    },
  },
  // tags: ['autodocs'],
  argTypes: {
    invalid: { control: 'boolean' },
  },
  decorators: [
    Story => (
      <div style={{ margin: '3em' }}>
        <h2 className="title-h2 mb-4">RadioButton</h2>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioButton>;

export default meta;

type Story = StoryObj<typeof meta>;

const categories = [
  { name: 'Accounting', key: 'A' },
  { name: 'Marketing', key: 'M' },
  { name: 'Production', key: 'P' },
  { name: 'Research', key: 'R' },
];

export const Default: Story = {
  args: {},
  render: () => {
    const [selectedCategory, setSelectedCategory] = useState(categories[1]);

    return (
      <div>
        <Group title="Basic">
          <div className="flex gap-4">
            {categories.map(category => {
              return (
                <div key={category.key} className="flex align-items-center">
                  <RadioButton
                    inputId={category.key}
                    name="category"
                    value={category}
                    onChange={e => setSelectedCategory(e.value)}
                    checked={selectedCategory.key === category.key}
                  />
                  <label htmlFor={category.key} className="ml-2">
                    {category.name}
                  </label>
                </div>
              );
            })}
          </div>
        </Group>
        <Group title="Filled">
          <div className="flex gap-4">
            {categories.map(category => {
              return (
                <div key={category.key} className="flex align-items-center">
                  <RadioButton
                    inputId={category.key}
                    name="category"
                    value={category}
                    onChange={e => setSelectedCategory(e.value)}
                    checked={selectedCategory.key === category.key}
                    variant="filled"
                  />
                  <label htmlFor={category.key} className="ml-2">
                    {category.name}
                  </label>
                </div>
              );
            })}
          </div>
        </Group>
        <Group title="Invalid">
          <div className="flex gap-4">
            {categories.map(category => {
              return (
                <div key={category.key} className="flex align-items-center">
                  <RadioButton
                    inputId={category.key}
                    name="category"
                    value={category}
                    onChange={e => setSelectedCategory(e.value)}
                    checked={
                      selectedCategory.key === category.key ? true : false
                    }
                    invalid
                  />
                  <label htmlFor={category.key} className="ml-2">
                    {category.name}
                  </label>
                </div>
              );
            })}
          </div>
        </Group>
        <Group title="Disabled">
          <div className="flex gap-4">
            {categories.map(category => {
              return (
                <div key={category.key} className="flex align-items-center">
                  <RadioButton
                    inputId={category.key}
                    name="category"
                    value={category}
                    onChange={e => setSelectedCategory(e.value)}
                    checked={selectedCategory.key === category.key}
                    disabled
                  />
                  <label htmlFor={category.key} className="ml-2">
                    {category.name}
                  </label>
                </div>
              );
            })}
          </div>
        </Group>
      </div>
    );
  },
};

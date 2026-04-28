import { Meta, StoryObj } from '@storybook/react';
import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';
import { IconFile, IconPlus, IconTrash } from '@tabler/icons-react';
import { Group } from '../../common/Group';

const meta = {
  title: 'Components/Menu/PanelMenu',
  component: PanelMenu,
  argTypes: {
    // unstyled: { control: 'boolean' },
  },
  // tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ margin: '3em' }}>
        <h2 className="title-h2 mb-4">PanelMenu</h2>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PanelMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultItems: MenuItem[] = [
  {
    label: 'File',
    items: [
      {
        label: 'New File',
      },
      {
        label: 'Delete File',
      },
    ],
  },
  {
    label: 'Folder 1',
    items: [
      {
        label: 'New Folder 1',
      },
      {
        label: 'Edit Folder 1',
      },
      {
        label: 'Delete Folder 1',
      },
    ],
  },
  {
    label: 'Folder 2',
    items: [
      {
        label: 'New Folder 2',
      },
      {
        label: 'Delete Folder 2',
      },
    ],
  },
];

const itemsWithIcons: MenuItem[] = [
  {
    label: 'File',
    icon: <IconFile className="p-menuitem-icon" />,
    items: [
      {
        label: 'New',
        icon: <IconPlus className="p-menuitem-icon" />,
      },
      {
        label: 'Delete',
        icon: <IconTrash className="p-menuitem-icon" />,
      },
    ],
  },
];

const itemsWithDisabledStatus: MenuItem[] = [
  {
    label: 'File',
    disabled: true,
    items: [
      {
        label: 'New File',
      },
      {
        label: 'Delete File',
      },
    ],
  },
  {
    label: 'Folder',
    disabled: true,
    items: [
      {
        label: 'New Folder',
      },
      {
        label: 'Delete Folder',
      },
    ],
  },
];
const subitemsWithDisabledStatus: MenuItem[] = [
  {
    label: 'File',
    items: [
      {
        label: 'New File',
        disabled: true,
      },
      {
        label: 'Delete File',
        disabled: true,
      },
    ],
  },
  {
    label: 'Folder',
    items: [
      {
        label: 'New Folder',
        disabled: true,
      },
      {
        label: 'Delete Folder',
        disabled: true,
      },
    ],
  },
];

export const Default: Story = {
  render: () => {
    return (
      <div>
        <Group title="Basic">
          <PanelMenu model={defaultItems} />
        </Group>
        <Group title="Unstyled">
          <PanelMenu model={defaultItems} unstyled />
        </Group>
        <Group
          title="With Icons"
          description={
            <>
              Для установки базового размера иконки - добавить на неё класс{' '}
              <code>
                <strong>p-menuitem-icon</strong>
              </code>
              .
            </>
          }
        >
          <PanelMenu model={itemsWithIcons} />
        </Group>
        <Group title="Disabled">
          <PanelMenu model={itemsWithDisabledStatus} />
        </Group>
        <Group title="Subitems Disabled">
          <PanelMenu model={subitemsWithDisabledStatus} />
        </Group>
      </div>
    );
  },
};

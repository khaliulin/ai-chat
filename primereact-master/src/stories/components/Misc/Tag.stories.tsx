import { Meta, StoryObj } from '@storybook/react';
import { Tag, TagProps } from 'primereact/tag';
import { useArgs } from 'storybook/internal/preview-api';
import { IconCheck, IconStar } from '@tabler/icons-react';
import { Group } from '../../common/Group';

const meta = {
  title: 'Components/Misc/Tag',
  component: Tag,
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
    icon: {
      control: {
        type: 'select',
        labels: {
          undefined: 'Без иконки',
          customIcon: 'Своя иконка, переданная в props icon',
        },
      },
      options: [undefined, 'customIcon'],
    },
    rounded: { control: 'boolean' },
    unstyled: { control: 'boolean' },
  },
  decorators: [
    Story => (
      <div style={{ margin: '3em' }}>
        <h2 className="title-h2 mb-4">Tag</h2>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

const severities: TagProps['severity'][] = [
  'success',
  'info',
  'warning',
  'danger',
  // 'contrast',
  'secondary',
  undefined,
];

export const Default: Story = {
  args: {
    value: 'Интерактивный элемент',
    severity: 'success',
    rounded: false,
    unstyled: false,
  },
  render: () => {
    const [{ value, severity, icon, rounded, unstyled }] = useArgs();

    return (
      <div>
        <Group title="Basic">
          <Tag value="Basic text" />
        </Group>
        <Group title="Unstyled">
          <Tag value="Unstyled Tag" unstyled />
        </Group>
        <Group title="Severities" className="flex gap-4">
          {severities.map(severity => (
            <Tag
              key={severity}
              severity={severity == undefined ? undefined : severity}
              value={severity == undefined ? 'primary' : severity}
            />
          ))}
        </Group>
        <Group title="Rounded" className="flex gap-4">
          {severities.map(severity => (
            <Tag
              key={severity}
              severity={severity == undefined ? undefined : severity}
              value={severity == undefined ? 'primary' : severity}
              rounded
            />
          ))}
        </Group>
        <Group
          title="Icon"
          description={
            <>
              По-умолчанию у иконки размеры равны шрифту (0,75rem = 10.5px). Для
              того, чтобы сделать размеры 14px&nbsp;*&nbsp;14px нужно на иконку
              добавить класс-модификатор{' '}
              <code>
                <strong>p-tag-icon--base</strong>
              </code>
              . Класс{' '}
              <code>
                <strong>p-tag-icon</strong>
              </code>{' '}
              добавляет отступ между текстом и иконкой.
            </>
          }
          className="flex gap-4"
        >
          {severities.map(severity => (
            <Tag
              key={severity}
              icon={
                <IconCheck className="p-tag-icon p-tag-icon--base"></IconCheck>
              }
              severity={severity == undefined ? undefined : severity}
              value={severity == undefined ? 'primary' : severity}
            />
          ))}
        </Group>
        <Group
          title="Template"
          description={
            <>
              Когда передается свой Template, то разработчик сам контролирует
              содержимое тега.
            </>
          }
          className="flex gap-4"
        >
          <Tag>
            <div className="flex items-center gap-2">
              <span className="text-base">Russia</span>
              <IconStar className="icon-md"></IconStar>
            </div>
          </Tag>
        </Group>
        <Group
          title="Interactive"
          description={
            <>
              Если в поле <strong>value</strong> стереть текст, то будет видно
              Custom Template.
            </>
          }
          last
        >
          <Tag
            value={value}
            severity={severity}
            rounded={rounded}
            unstyled={unstyled}
            icon={
              icon === 'customIcon' ? (
                <IconCheck className="p-tag-icon p-tag-icon--base"></IconCheck>
              ) : undefined
            }
          >
            {value === '' && (
              <div className="flex items-center gap-2">
                <span className="text-base">Custom Template</span>
                <IconStar className="icon-xs"></IconStar>
              </div>
            )}
          </Tag>
        </Group>
      </div>
    );
  },
};

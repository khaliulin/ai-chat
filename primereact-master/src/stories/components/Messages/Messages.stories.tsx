import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { useArgs } from 'storybook/internal/preview-api';
import { Button } from 'primereact/button';
import { Messages, MessagesProps } from '../../../components/messages';
import { Group } from '../../common/Group.tsx';

const meta = {
  title: 'Components/Messages/Messages',
  component: Messages,
  argTypes: {
    summary: { control: 'text' },
    detail: { control: 'text' },
    severity: {
      control: { type: 'select' },
      options: [
        'success',
        'info',
        'warn',
        'error',
        'secondary',
        'contrast',
        undefined,
      ],
    },
    closable: { control: 'boolean' },
    withoutIcon: { control: 'boolean' },
    children: {
      control: {
        type: 'select',
        labels: {
          show: 'Показать children',
          hide: 'Скрыть children',
        },
      },
      options: ['show', 'hide'],
    },
    // unstyled: { control: 'boolean' }, // TODO надо реализовать на уровне кастомного компонента
  },
  decorators: [
    Story => (
      <div style={{ margin: '3em' }}>
        <h2 className="title-h2 mb-4">Messages (Custom Component)</h2>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Messages>;

export default meta;

type Story = StoryObj<typeof meta>;

const severities: MessagesProps['severity'][] = [
  'success',
  'info',
  'warn',
  'error',
  'secondary',
  'contrast',
  undefined,
];

const ClosableWrapper = () => {
  const [isVisible, setIsVisible] = useState(true);

  return isVisible ? (
    <Messages
      summary="This is a closable Messages"
      closable
      onClose={setIsVisible}
      isAlignCenterTitle
    />
  ) : (
    <Button onClick={() => setIsVisible(true)}>Show closable Messages</Button>
  );
};

export const Default: Story = {
  args: {
    summary: 'Summary',
    detail: 'Detail',
    severity: 'success',
    closable: false,
    withoutIcon: false,
    children: 'show',
    // unstyled: false,
  },

  render: () => {
    const [{ summary, detail, severity, closable, withoutIcon, children }] =
      useArgs();

    return (
      <div>
        <Group title="Default">
          <Messages summary="Default Summary" detail="Default Detail" />
        </Group>
        <Group
          title="Severities"
          description={
            <>
              Значениями выступают:{' '}
              <code>
                <strong>success</strong>
              </code>
              ,{' '}
              <code>
                <strong>info</strong>
              </code>
              ,{' '}
              <code>
                <strong>warn</strong>
              </code>
              ,{' '}
              <code>
                <strong>error</strong>
              </code>
              ,{' '}
              <code>
                <strong>secondary</strong>
              </code>
              ,{' '}
              <code>
                <strong>contrast</strong>
              </code>
              ,{' '}
              <code>
                <strong>undefined</strong>
              </code>
            </>
          }
          className="flex gap-4"
        >
          {severities.map(severity => (
            <Messages
              key={severity === undefined ? 'undefined' : severity}
              severity={severity}
              summary={severity}
            />
          ))}
        </Group>
        <Group title="Closable">
          <ClosableWrapper />
        </Group>
        <Group title="With Children">
          <Messages
            summary="Summary with children"
            detail="Detail with children"
          >
            <h4 className="title-h4">This is children content</h4>
            <p className="body-regular-base-paragraph">
              Example Grid (2 columns)
            </p>
            <div className="grid grid-cols-2">
              <div className="px-4 py-3 bg-black-40 text-white-80">
                Cell One
              </div>
              <div className="px-4 py-3 bg-info-400 text-black-60">
                Cell Two
              </div>
            </div>
          </Messages>
        </Group>
        <Group title="Interactive" last>
          <Messages
            summary={summary}
            detail={detail}
            severity={severity}
            closable={closable}
            withoutIcon={withoutIcon}
          >
            {children === 'show' && (
              <div>
                <h4 className="title-h4">Children for interactive</h4>
                <p className="body-regular-base-paragraph">
                  Hello Cdek! This is children content for interactive example.
                  You can show or hide it using controls in Storybook.
                </p>
              </div>
            )}
          </Messages>
        </Group>
      </div>
    );
  },
};

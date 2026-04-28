import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Timeline, TimelineProps } from 'primereact/timeline';
import { useArgs } from 'storybook/internal/preview-api';
import { UPDATE_GLOBALS } from 'storybook/internal/core-events';

export default {
  title: 'Components/Data/Timeline',
  component: Timeline,
  argTypes: {
    align: {
      control: 'radio',
      options: ['left', 'right', 'alternate'],
    },
    oppositeEnabled: { control: 'boolean' },
    layout: {
      control: 'radio',
      options: [
        'vertical',
        // 'horizontal',
      ],
    },
  },
} as Meta;

interface TimelineEvent {
  status?: string;
  opposite?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}

interface TimelineStoryProps extends TimelineProps {
  oppositeEnabled: boolean;
}

const Template: StoryFn<TimelineStoryProps> = args => {
  const [{ oppositeEnabled, layout }] = useArgs();

  const events: TimelineEvent[] = [
    {
      status: 'Ordered',
      opposite: 'Ordered opposite',
      date: '15/10/2020 10:30',
      icon: 'pi pi-shopping-cart',
      color: '#9C27B0',
    },
    {
      status: 'Processing',
      opposite: 'Processing opposite',
      date: '15/10/2020 14:00',
      icon: 'pi pi-cog',
      color: '#673AB7',
    },
    {
      status: 'Shipped',
      opposite: 'Shipped opposite',
      date: '15/10/2020 16:15',
      icon: 'pi pi-shopping-cart',
      color: '#FF9800',
    },
    {
      status: 'Delivered',
      opposite: 'Delivered opposite',
      date: '16/10/2020 10:00',
      icon: 'pi pi-check',
      color: '#607D8B',
    },
  ];

  return (
    <Timeline
      {...args}
      value={events}
      content={item => (
        <div className="flex flex-col gap-1">
          <span className="body-bold-base-paragraph text-nowrap">
            {item.status}
          </span>
          <span className="caption-secondary text-nowrap">{item.date}</span>
        </div>
      )}
      opposite={item =>
        oppositeEnabled ? (
          <div className="flex flex-col gap-1">
            <span className="body-bold-base-paragraph text-nowrap">
              {item.opposite}
            </span>
            <span className="caption-secondary text-nowrap">{item.date}</span>
          </div>
        ) : layout === 'horizontal' ? (
          <div className="flex flex-col gap-1">
            <span className="body-bold-base-paragraph text-nowrap">&nbsp;</span>
            <span className="caption-secondary text-nowrap">&nbsp;</span>
          </div>
        ) : null
      }
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  align: 'left',
  oppositeEnabled: false,
  layout: 'vertical',
};

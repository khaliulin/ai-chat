import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Timeline, TimelineProps } from 'primereact/timeline';
import { useArgs } from 'storybook/internal/preview-api';
import { UPDATE_GLOBALS } from 'storybook/internal/core-events';

export default {
  title: 'Components/Data/Timeline',
  component: Timeline,
  argTypes: {},
} as Meta;

interface TimelineStoryProps extends TimelineProps {
  oppositeEnabled: boolean;
}

export const HorizontalDemo: StoryFn<TimelineStoryProps> = args => {
  const events = ['2020', '2021', '2022', '2023'];

  return (
    <div className="flex flex-col gap-3">
      <Timeline
        value={events}
        layout="horizontal"
        align="top"
        content={item => (
          <div className="flex flex-col gap-1">
            <span className="body-bold-base-paragraph text-nowrap">{item}</span>
            <span className="caption-secondary text-nowrap">{item}</span>
          </div>
        )}
      />
      <Timeline
        value={events}
        layout="horizontal"
        align="bottom"
        content={item => (
          <div className="flex flex-col gap-1">
            <span className="body-bold-base-paragraph text-nowrap">{item}</span>
            <span className="caption-secondary text-nowrap">{item}</span>
          </div>
        )}
      />
      <Timeline
        value={events}
        layout="horizontal"
        align="alternate"
        content={item => (
          <div className="flex flex-col gap-1">
            <span className="body-bold-base-paragraph text-nowrap">{item}</span>
            <span className="caption-secondary text-nowrap">{item}</span>
          </div>
        )}
        opposite={() => (
          <div className="flex flex-col gap-1">
            <span className="body-bold-base-paragraph text-nowrap">&nbsp;</span>
            <span className="caption-secondary text-nowrap">&nbsp;</span>
          </div>
        )}
      />
    </div>
  );
};

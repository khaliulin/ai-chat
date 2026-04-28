import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { Group } from '../../common/Group';

const meta = {
  title: 'Components/Form/Calendar',
  component: Calendar,
  decorators: [
    Story => (
      <div style={{ margin: '3em' }}>
        <h2 className="title-h2 mb-4">Calendar</h2>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Nullable<Date>>(null);
    const [multipleDates, setMultipleDates] = useState<Nullable<Date[]>>(null);
    const [rangeDates, setRangeDates] =
      useState<Nullable<(Date | null)[]>>(null);
    const [datetime12h, setDateTime12h] = useState<Nullable<Date>>(null);
    const [datetime24h, setDateTime24h] = useState<Nullable<Date>>(null);
    const [time, setTime] = useState<Nullable<Date>>(null);
    const [month, setMonth] = useState<Nullable<Date>>(null);
    const [year, setYear] = useState<Nullable<Date>>(null);

    return (
      <div>
        <Group title="Basic">
          <Calendar value={date} onChange={e => setDate(e.value)} />
        </Group>
        <Group title="Month and year as dropdowns">
          <Calendar
            value={date}
            onChange={e => setDate(e.value)}
            monthNavigator
            yearNavigator
          />
        </Group>
        <Group
          title="Date format"
          description={
            <>
              Формат даты установлен как <strong>dd/mm/yy</strong>. По-умолчанию
              используется <strong>mm/dd/yy</strong>.
            </>
          }
        >
          <Calendar value={new Date()} dateFormat="dd/mm/yy" />
        </Group>
        <Group
          title="Selection mode"
          description="Режим выбора нескольких дат."
        >
          <Calendar
            value={multipleDates}
            onChange={e => setMultipleDates(e.value)}
            selectionMode="multiple"
          />
        </Group>
        <Group
          title="Range mode"
          description={
            <>
              Режим выбора периода дат. Если передать пропс{' '}
              <strong>hideOnRangeSelection</strong>, то календарь будет
              скрываться после выбора второго значения.
            </>
          }
        >
          <Calendar
            value={rangeDates}
            onChange={e => setRangeDates(e.value)}
            selectionMode="range"
            hideOnRangeSelection
          />
        </Group>
        <Group title="Button Bar">
          <Calendar
            value={date}
            onChange={e => setDate(e.value)}
            showButtonBar
          />
        </Group>
        <Group title="Time Picker">
          <div className="flex gap-3">
            <div className="flex-auto">
              <label htmlFor="calendar-12h" className="font-bold block mb-2">
                12h Format
              </label>
              <Calendar
                id="calendar-12h"
                value={datetime12h}
                onChange={e => setDateTime12h(e.value)}
                showTime
                hourFormat="12"
              />
            </div>
            <div className="flex-auto">
              <label htmlFor="calendar-24h" className="font-bold block mb-2">
                24h Format
              </label>
              <Calendar
                id="calendar-24h"
                value={datetime24h}
                onChange={e => setDateTime24h(e.value)}
                showTime
                hourFormat="24"
              />
            </div>
            <div className="flex-auto">
              <label
                htmlFor="calendar-timeonly"
                className="font-bold block mb-2"
              >
                Time Only
              </label>
              <Calendar
                id="calendar-timeonly"
                value={time}
                onChange={e => setTime(e.value)}
                timeOnly
              />
            </div>
          </div>
        </Group>
        <Group title="Month Picker">
          <Calendar
            value={month}
            onChange={e => setMonth(e.value)}
            view="month"
            dateFormat="mm/yy"
          />
        </Group>
        <Group title="Year Picker">
          <Calendar
            value={year}
            onChange={e => setYear(e.value)}
            view="year"
            dateFormat="yy"
          />
        </Group>
        <Group title="Multiple Months">
          <Calendar
            value={date}
            onChange={e => setDate(e.value)}
            numberOfMonths={3}
          />
        </Group>
      </div>
    );
  },
};

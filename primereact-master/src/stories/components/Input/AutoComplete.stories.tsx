import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { AutoComplete, AutoCompleteProps } from 'primereact/autocomplete';
import { userEvent, within, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';


export default {
  title: 'Components/Input/AutoComplete',
  component: AutoComplete,
} as Meta;

const Template: StoryFn<AutoCompleteProps & { initialValue?: string }> = (args) => {
    const [value, setValue] = useState(args.initialValue || '');
    const [items, setItems] = useState<string[]>([]);
    const allItems = ['ActionScript', 'AppleScript', 'Asp', 'Assembly', 'BASIC', 'C', 'C++', 'Clojure', 'COBOL', 'ColdFusion', 'Erlang', 'Fortran', 'Groovy', 'Haskell', 'Java', 'JavaScript', 'Lisp', 'Perl', 'PHP', 'Python', 'Ruby', 'Scala', 'Scheme'];

    const search = (event) => {
        let _items = allItems.filter((item) => {
            return item.toLowerCase().startsWith(event.query.toLowerCase());
        });
        setItems(_items);
    }

    return (
        <AutoComplete {...args} value={value} suggestions={items} completeMethod={search} onChange={(e) => setValue(e.value)} />
    )
}
export const Default = Template.bind({});
Default.args = {};

export const Filled = Template.bind({});
Filled.args = {
  initialValue: 'JavaScript',
};

export const Open = Template.bind({});
Open.args = {};
Open.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const input = await canvas.getByRole('combobox');
  await userEvent.click(input);
  await userEvent.type(input, 'J', { delay: 100 });

  await waitFor(() => {
    const panel = document.querySelector('.p-autocomplete-panel');
    expect(panel).toBeVisible();
  });
};
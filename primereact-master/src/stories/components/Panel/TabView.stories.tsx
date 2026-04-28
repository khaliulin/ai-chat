import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { TabView, TabPanel, TabViewProps } from 'primereact/tabview';

export default {
  title: 'Components/Panel/TabView',
  component: TabView,
} as Meta;

const Template: StoryFn<TabViewProps> = (args) => {
    return (
        <TabView {...args}>
            <TabPanel header="Header I">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            </TabPanel>
            <TabPanel header="Header II">
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem...</p>
            </TabPanel>
            <TabPanel header="Header III">
                <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui...</p>
            </TabPanel>
        </TabView>
    )
}
export const Default = Template.bind({});
Default.args = {}; 
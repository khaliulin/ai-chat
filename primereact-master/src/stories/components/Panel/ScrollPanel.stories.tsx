import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { ScrollPanel, ScrollPanelProps } from 'primereact/scrollpanel';

export default {
  title: 'Components/Panel/ScrollPanel',
  component: ScrollPanel,
} as Meta;

const Template: StoryFn<ScrollPanelProps> = (args) => {
    return (
        <ScrollPanel {...args} style={{ width: '100%', height: '200px' }}>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </ScrollPanel>
    )
}
export const Default = Template.bind({});
Default.args = {}; 
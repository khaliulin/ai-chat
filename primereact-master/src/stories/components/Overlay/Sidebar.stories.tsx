import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Sidebar, SidebarProps } from 'primereact/sidebar';
import { Button } from 'primereact/button';

export default {
    title: 'Components/Overlay/Sidebar',
    component: Sidebar
} as Meta;

const Template: StoryFn<SidebarProps> = (args) => {
    const [visible, setVisible] = useState(false);

    return (
        <div>
            <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
            <Sidebar {...args} visible={visible} onHide={() => setVisible(false)}>
                <h2>Sidebar</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </Sidebar>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {}; 
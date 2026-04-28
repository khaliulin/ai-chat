import React, { useRef } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { ContextMenu, ContextMenuProps } from 'primereact/contextmenu';
import { MenuItem } from 'primereact/menuitem';

export default {
    title: 'Components/Menu/ContextMenu',
    component: ContextMenu
} as Meta;

const Template: StoryFn<ContextMenuProps> = (args) => {
    const cm = useRef<ContextMenu>(null);
    const items: MenuItem[] = [
        { label: 'View', icon: 'pi pi-fw pi-search' },
        { label: 'Delete', icon: 'pi pi-fw pi-trash' }
    ];

    return (
        <div>
            <div onContextMenu={(e) => cm.current?.show(e)} style={{ border: '1px solid #ccc', padding: '1rem' }}>
                Right click here
            </div>
            <ContextMenu {...args} model={items} ref={cm} />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {}; 
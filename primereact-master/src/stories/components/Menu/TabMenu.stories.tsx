import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { TabMenu, TabMenuProps } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem';

export default {
    title: 'Components/Menu/TabMenu',
    component: TabMenu
} as Meta;

const Template: StoryFn<TabMenuProps> = (args) => {
    const items: MenuItem[] = [
        { label: 'Home', icon: 'pi pi-fw pi-home' },
        { label: 'Calendar', icon: 'pi pi-fw pi-calendar' },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil' },
        { label: 'Documentation', icon: 'pi pi-fw pi-file' },
        { label: 'Settings', icon: 'pi pi-fw pi-cog' }
    ];
    
    return (
        <TabMenu {...args} model={items} />
    );
};

export const Default = Template.bind({});
Default.args = {}; 
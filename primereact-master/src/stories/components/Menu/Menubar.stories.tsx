import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Menubar, MenubarProps } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';

export default {
    title: 'Components/Menu/Menubar',
    component: Menubar
} as Meta;

const Template: StoryFn<MenubarProps> = (args) => {
    const items: MenuItem[] = [
        { label: 'Home', icon: 'pi pi-fw pi-home' },
        { label: 'Features', icon: 'pi pi-fw pi-star' },
        { label: 'Projects', icon: 'pi pi-fw pi-search' },
        { label: 'Contact', icon: 'pi pi-fw pi-envelope' }
    ];
    
    return (
        <Menubar {...args} model={items} />
    );
};

export const Default = Template.bind({});
Default.args = {}; 
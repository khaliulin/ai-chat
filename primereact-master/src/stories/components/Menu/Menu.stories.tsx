import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Menu, MenuProps } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';

export default {
    title: 'Components/Menu/Menu',
    component: Menu
} as Meta;

const Template: StoryFn<MenuProps> = (args) => {
    const items: MenuItem[] = [
        { label: 'New', icon: 'pi pi-fw pi-plus' },
        { label: 'Delete', icon: 'pi pi-fw pi-trash' }
    ];
    
    return (
        <Menu {...args} model={items} />
    );
};

export const Default = Template.bind({});
Default.args = {}; 
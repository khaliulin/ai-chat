import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { TieredMenu, TieredMenuProps } from 'primereact/tieredmenu';
import { MenuItem } from 'primereact/menuitem';

export default {
    title: 'Components/Menu/TieredMenu',
    component: TieredMenu
} as Meta;

const Template: StoryFn<TieredMenuProps> = (args) => {
    const items: MenuItem[] = [
        { label: 'File', icon: 'pi pi-fw pi-file' },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil' },
        { label: 'Users', icon: 'pi pi-fw pi-user' }
    ];
    
    return (
        <TieredMenu {...args} model={items} />
    );
};

export const Default = Template.bind({});
Default.args = {}; 
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { MegaMenu, MegaMenuProps } from 'primereact/megamenu';
import { MenuItem } from 'primereact/menuitem';

export default {
    title: 'Components/Menu/MegaMenu',
    component: MegaMenu
} as Meta;

const Template: StoryFn<MegaMenuProps> = (args) => {
    const items: MenuItem[] = [
        { label: 'Home', icon: 'pi pi-fw pi-home' },
        { label: 'TV', icon: 'pi pi-fw pi-desktop' },
        { label: 'Sports', icon: 'pi pi-fw pi-ball' },
        { label: 'Register', icon: 'pi pi-fw pi-user-plus' }
    ];
    
    return (
        <MegaMenu {...args} model={items} />
    );
};

export const Default = Template.bind({});
Default.args = {}; 
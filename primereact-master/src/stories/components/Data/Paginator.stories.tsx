import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Paginator, PaginatorProps, PaginatorPageChangeEvent } from 'primereact/paginator';

export default {
    title: 'Components/Data/Paginator',
    component: Paginator
} as Meta;

const Template: StoryFn<PaginatorProps> = (args) => {
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    
    return (
        <Paginator {...args} first={first} rows={rows} totalRecords={120} onPageChange={onPageChange} />
    );
};

export const Default = Template.bind({});
Default.args = {}; 
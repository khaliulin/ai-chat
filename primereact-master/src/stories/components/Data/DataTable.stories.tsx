import React, { useState, useEffect } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { DataTable, DataTableProps } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default {
    title: 'Components/Data/DataTable',
    component: DataTable
} as Meta;

interface Product {
    id: string;
    code: string;
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;
    quantity: number;
    inventoryStatus: string;
    rating: number;
}

const Template: StoryFn<DataTableProps<Product[]>> = (args) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Mock product data
        setProducts([
            {id: '1000', code: 'f230fh0g3', name: 'Bamboo Watch', description: 'Product Description', image: 'bamboo-watch.jpg', price: 65, category: 'Accessories', quantity: 24, inventoryStatus: 'INSTOCK', rating: 5},
            {id: '1001', code: 'nvklal433', name: 'Black Watch', description: 'Product Description', image: 'black-watch.jpg', price: 72, category: 'Accessories', quantity: 61, inventoryStatus: 'INSTOCK', rating: 4}
        ]);
    }, []);
    
    return (
        <DataTable {...args} value={products}>
            <Column field="code" header="Code"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="category" header="Category"></Column>
            <Column field="quantity" header="Quantity"></Column>
        </DataTable>
    );
};

export const Default = Template.bind({});
Default.args = {}; 
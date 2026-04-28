import React, { useState, useEffect } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Carousel, CarouselProps } from 'primereact/carousel';
import { Button } from 'primereact/button';

export default {
    title: 'Components/Data/Carousel',
    component: Carousel
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

const Template: StoryFn<CarouselProps> = (args) => {
    const [products, setProducts] = useState<Product[]>([]);
    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '600px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '480px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    useEffect(() => {
        // Mock product data
        setProducts([
            {id: '1000', code: 'f230fh0g3', name: 'Bamboo Watch', description: 'Product Description', image: 'bamboo-watch.jpg', price: 65, category: 'Accessories', quantity: 24, inventoryStatus: 'INSTOCK', rating: 5},
            {id: '1001', code: 'nvklal433', name: 'Black Watch', description: 'Product Description', image: 'black-watch.jpg', price: 72, category: 'Accessories', quantity: 61, inventoryStatus: 'INSTOCK', rating: 4}
        ]);
    }, []);

    const productTemplate = (product: Product) => {
        return (
            <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
                <div className="mb-3">
                    <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.name} className="w-6 shadow-2" />
                </div>
                <div>
                    <h4 className="mb-1">{product.name}</h4>
                    <h6 className="mt-0 mb-3">${product.price}</h6>
                </div>
            </div>
        );
    };
    
    return (
        <Carousel {...args} value={products} numVisible={3} numScroll={1} responsiveOptions={responsiveOptions} itemTemplate={productTemplate} />
    );
};

export const Default = Template.bind({});
Default.args = {}; 
import React, { useState, useEffect } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Galleria, GalleriaProps } from 'primereact/galleria';

export default {
    title: 'Components/Multimedia/Galleria',
    component: Galleria
} as Meta;

interface Photo {
    itemImageSrc: string;
    thumbnailImageSrc: string;
    alt: string;
    title: string;
}

const Template: StoryFn<GalleriaProps> = (args) => {
    const [images, setImages] = useState<Photo[]>([]);

    useEffect(() => {
        // Mock photo data
        setImages([
            { itemImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria1.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria1s.jpg', alt: 'Description for Image 1', title: 'Title 1' },
            { itemImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria2.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria2s.jpg', alt: 'Description for Image 2', title: 'Title 2' }
        ]);
    }, []);

    const itemTemplate = (item: Photo) => {
        return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%' }} />;
    }

    const thumbnailTemplate = (item: Photo) => {
        return <img src={item.thumbnailImageSrc} alt={item.alt} />;
    }
    
    return (
        <Galleria {...args} value={images} item={itemTemplate} thumbnail={thumbnailTemplate} />
    );
};

export const Default = Template.bind({});
Default.args = {}; 
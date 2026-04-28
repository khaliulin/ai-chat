import React, { useRef } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { OverlayPanel, OverlayPanelProps } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';

export default {
    title: 'Components/Overlay/OverlayPanel',
    component: OverlayPanel
} as Meta;

const Template: StoryFn<OverlayPanelProps> = (args) => {
    const op = useRef<OverlayPanel>(null);

    return (
        <div>
            <Button type="button" icon="pi pi-image" label="Image" onClick={(e) => op.current?.toggle(e)} />
            <OverlayPanel {...args} ref={op}>
                <p>Some content</p>
            </OverlayPanel>
        </div>
    );
}

export const Default = Template.bind({});
Default.args = {}; 
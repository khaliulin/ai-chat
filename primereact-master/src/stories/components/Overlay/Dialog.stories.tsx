import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Dialog } from 'primereact/dialog';
import { DialogProps } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default {
  title: 'Components/Overlay/Dialog',
  component: Dialog,
} as Meta;

const Template: StoryFn<DialogProps> = (args) => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog {...args} visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </Dialog>
        </>
    )
}
export const Default = Template.bind({});
Default.args = {
  header: 'Header',
}; 
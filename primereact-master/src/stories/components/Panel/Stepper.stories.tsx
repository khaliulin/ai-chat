import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Stepper, StepperProps } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';

export default {
  title: 'Components/Panel/Stepper',
  component: Stepper,
} as Meta;

const Template: StoryFn<StepperProps> = (args) => {
    return (
        <>
            <Stepper {...args}>
                <StepperPanel header="Header I">
                    <div className="flex flex-column h-12rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content I</div>
                    </div>
                </StepperPanel>
                <StepperPanel header="Header II">
                    <div className="flex flex-column h-12rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content II</div>
                    </div>
                </StepperPanel>
                <StepperPanel header="Header III">
                    <div className="flex flex-column h-12rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content III</div>
                    </div>
                </StepperPanel>
            </Stepper>
        </>
    )
}
export const Default = Template.bind({});
Default.args = {}; 
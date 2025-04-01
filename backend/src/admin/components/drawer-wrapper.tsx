// UI Components
import { Drawer, Heading } from "@medusajs/ui";

// React & State Management
import React from "react";

type DrawerWrapperProps = {
    heading: string;
    open: boolean;
    openChange: (open: boolean) => void;
    footer?: React.ReactNode;
    children: React.ReactNode;
};

export const DrawerWrapper = ({ heading, open, openChange, footer, children }: DrawerWrapperProps) => {
    return (
        <Drawer open={open} onOpenChange={(open) => openChange(open)}>
            <Drawer.Content>
                <Drawer.Header>
                    <Heading level="h1">{heading}</Heading>
                </Drawer.Header>
                <Drawer.Body className="flex flex-1 flex-col overflow-auto gap-y-4">
                    {children}
                </Drawer.Body>
                <Drawer.Footer>
                    {footer}
                </Drawer.Footer>
            </Drawer.Content>
        </Drawer>
    );
};
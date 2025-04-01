// UI Components
import { Badge, DropdownMenu, IconButton, Table } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare } from "@medusajs/icons";

// React & State Management
import { useState } from "react";

// Context
import { useOptionConfigsContext } from "../context/option-configs-context";

// Types
import { OptionConfig } from "../types";
import { OptionConfigDrawer } from "../drawers/option-config-drawer";

export const OptionConfigsTable = () => {
    const configs = useOptionConfigsContext();
    const [selectedOptionConfig, setSelectedOptionConfig] = useState<OptionConfig | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleEditClick = (optionConfig: OptionConfig) => {
        setSelectedOptionConfig(optionConfig);
        setDrawerOpen(true);
    };

    return (
        <>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Cell>Option Title</Table.Cell>
                <Table.Cell>Display Type</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            </Table.Header>
            <Table.Body className="border-b-0">
              {configs.map((config, index) => {
                const is_last = index === configs.length - 1;
    
                return (
                  <Table.Row key={config.id} className={`${is_last ? "border-b-0" : ""}`}>
                    <Table.Cell>{config.option_title}</Table.Cell>
                    <Table.Cell>
                      <Badge size="2xsmall">{config.display_type[0].toUpperCase() + config.display_type.slice(1)}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <IconButton size="small" variant="transparent">
                            <EllipsisHorizontal />
                          </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item
                            className="gap-x-2"
                            onClick={() => {
                                handleEditClick(config);
                            }}
                          >
                            <PencilSquare className="text-ui-fg-subtle" />
                            Edit
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
    
          {/* Drawer */}
          <OptionConfigDrawer optionConfig={selectedOptionConfig || configs[0]} open={drawerOpen} setOpen={setDrawerOpen} />
        </>
    );
};
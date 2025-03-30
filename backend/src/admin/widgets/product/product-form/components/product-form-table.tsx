// UI Components
import { Badge, DropdownMenu, IconButton, Table } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare } from "@medusajs/icons";

// Types
import { Form } from "../types";

type ProductFormTableProps = {
  form: Form;
  setModalOpen: (open: boolean) => void;
};

export const ProductFormTable: React.FC<ProductFormTableProps> = ({ form, setModalOpen }) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Cell>Name</Table.Cell>
          <Table.Cell>Active</Table.Cell>
          <Table.Cell># of Fields</Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
      </Table.Header>
      <Table.Body className="border-b-0">
        <Table.Row className="border-b-0">
          <Table.Cell>
            {form.name ? (
              form.name
            ) : (
              <>
                <Badge color="red" size="2xsmall">
                  N/A
                </Badge>
              </>
            )}
          </Table.Cell>
          <Table.Cell>
            {form.active ? (
              <Badge color="green" size="2xsmall">
                Yes
              </Badge>
            ) : (
              <Badge color="red" size="2xsmall">
                No
              </Badge>
            )}
          </Table.Cell>
          <Table.Cell>{form.fields.length}</Table.Cell>
          <Table.Cell>
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <IconButton size="small" variant="transparent">
                  <EllipsisHorizontal />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item className="gap-x-2" onClick={() => setModalOpen(true)}>
                  <PencilSquare className="text-ui-fg-subtle" />
                  Edit
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

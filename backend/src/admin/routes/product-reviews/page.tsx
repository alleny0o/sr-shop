// Route Configuration
import { defineRouteConfig } from "@medusajs/admin-sdk";

// UI Components
import {
  createDataTableColumnHelper,
  createDataTableCommandHelper,
  Container,
  DataTable,
  useDataTable,
  Heading,
  StatusBadge,
  Toaster,
  DataTablePaginationState,
  DataTableRowSelectionState,
  toast,
} from "@medusajs/ui";
import { ChatBubbleLeftRight } from "@medusajs/icons";

// Local Types
import { Review } from "./types";

// React & State Management
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// JS SDK
import { sdk } from "../../lib/config";

// Routing
import { Link } from "react-router-dom";

const columnHelper = createDataTableColumnHelper<Review>();

const columns = [
  columnHelper.select(),
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("title", {
    header: "Title",
  }),
  columnHelper.accessor("rating", {
    header: "Rating",
  }),
  columnHelper.accessor("content", {
    header: "Content",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      const color = row.original.status === "approved" ? "green" : row.original.status === "rejected" ? "red" : "grey";
      return (
        <StatusBadge color={color}>{row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}</StatusBadge>
      );
    },
  }),
  columnHelper.accessor("product", {
    header: "Product",
    cell: ({ row }) => {
      return <Link to={`/products/${row.original.product_id}`}>{row.original.product?.title}</Link>;
    },
  }),
];

const commandHelper = createDataTableCommandHelper();

const useCommands = (refetch: () => void) => {
  return [
    commandHelper.command({
      label: "Approve",
      shortcut: "A",
      action: async (selection) => {
        const reviewsToApproveIds = Object.keys(selection);

        sdk.client
          .fetch("/admin/reviews/status", {
            method: "POST",
            body: {
              ids: reviewsToApproveIds,
              status: "approved",
            },
          })
          .then(() => {
            toast.success("Reviews approved");
            refetch();
          })
          .catch(() => {
            toast.error("Failed to approve reviews");
          });
      },
    }),
    commandHelper.command({
      label: "Reject",
      shortcut: "R",
      action: async (selection) => {
        const reviewsToRejectIds = Object.keys(selection);

        sdk.client
          .fetch("/admin/reviews/status", {
            method: "POST",
            body: {
              ids: reviewsToRejectIds,
              status: "rejected",
            },
          })
          .then(() => {
            toast.success("Reviews rejected");
            refetch();
          })
          .catch(() => {
            toast.error("Failed to reject reviews");
          });
      },
    }),
  ];
};

const limit = 15;

const ProductReviewsPage = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });

  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>({});

  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);

  const { data, isLoading, refetch } = useQuery<{
    reviews: Review[];
    count: number;
    limit: number;
    offset: number;
  }>({
    queryKey: ["reviews", offset, limit],
    queryFn: () =>
      sdk.client.fetch("/admin/product-review", {
        query: {
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          order: "-created_at",
        },
      }),
  });

  const commands = useCommands(refetch);

  const table = useDataTable({
    columns,
    data: data?.reviews || [],
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    getRowId: (row) => row.id,
    commands,
    rowSelection: {
      state: rowSelection,
      onRowSelectionChange: setRowSelection,
    },
  });

  return (
    <Container className="p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Reviews</Heading>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
        <DataTable.CommandBar selectedLabel={(count) => `${count} selected`} />
      </DataTable>
      <Toaster />
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Reviews",
  icon: ChatBubbleLeftRight,
});

export default ProductReviewsPage;

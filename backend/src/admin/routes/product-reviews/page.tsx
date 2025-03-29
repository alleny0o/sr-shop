// Route Configuration
import { defineRouteConfig } from "@medusajs/admin-sdk";

// UI Components
import {
  createDataTableColumnHelper,
  Container,
  DataTable,
  useDataTable,
  Heading,
  StatusBadge,
  Toaster,
  DataTablePaginationState,
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

const limit = 15

const ProductReviewsPage = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  })

  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])

  const { data, isLoading, refetch } = useQuery<{
    reviews: Review[]
    count: number
    limit: number
    offset: number
  }>({
    queryKey: ["reviews", offset, limit],
    queryFn: () => sdk.client.fetch("/admin/product-review", {
      query: {
        offset: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
        order: "-created_at",
      },
    }),
  })

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
  })

  return (
    <Container className="p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>
            Reviews
          </Heading>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
      <Toaster />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Reviews",
  icon: ChatBubbleLeftRight,
})

export default ProductReviewsPage;

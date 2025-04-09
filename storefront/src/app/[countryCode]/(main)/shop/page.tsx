import { Metadata } from "next"

import { SortOptions } from "@modules/shop/components/refinement-list/sort-products"
import ProductsTemplate from "@modules/shop/templates"

export const metadata: Metadata = {
  title: "Shop",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function ProductsPage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  return (
    <ProductsTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}

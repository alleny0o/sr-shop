import React, { Suspense } from "react"
import MediaGallery from "@modules/product/components/media-gallery"
import ProductActions from "@modules/product/components/product-actions"
import ProductOnboardingCta from "@modules/product/components/product-onboarding-cta"
import RelatedProducts from "@modules/product/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"

import Breadcrumbs from "components/breadcrumbs"
import { EnrichedProduct } from "types/global"
import ProductPrice from "../components/product-price"

type ProductTemplateProps = {
  product: EnrichedProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-3 px-10">
        <Breadcrumbs productTitle={product.title} />
      </div>

      {/* Product Content Grid */}
      <div
        className="max-w-7xl mx-auto pt-0 pb-6 relative"
        data-testid="product-container"
      >

        <div className="grid grid-cols-1 small:grid-cols-12 gap-6">
          {/* Image Gallery - Takes up more space on desktop */}
          <div className="small:px-10 small:col-span-7 w-full">
            <MediaGallery product={product} />
          </div>

          {/* Product Actions - Goes below image on mobile, next to image on desktop */}
          <div className="px-6 small:col-span-5 small:mt-0 small:px-10">
            <div className="mb-4">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <ProductPrice product={product} />
            </div>
            <div className="small:top-48">
            <ProductOnboardingCta />
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate

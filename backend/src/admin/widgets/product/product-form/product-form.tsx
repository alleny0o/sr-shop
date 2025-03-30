// // Widget Configuration
import { defineWidgetConfig } from "@medusajs/admin-sdk";

// Widget Props
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";

// React & State Management
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Types
import { ProductFormFieldType, ProductFormType, Field, Form } from "./types";

// Custom Components
import { ProductFormModal } from "./modals/product-form-modal";
import { SectionText } from "../../../components/section-text";
import { SectionWrapper } from "../../../components/section-wrapper";
import { SectionLoader } from "../../../components/section-loader";
import { ProductFormTable } from "./components/product-form-table";

// JS SDK
import { sdk } from "../../../lib/config";

const ProductFormWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  // Product Form State
  const [form, setForm] = useState<Form | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);

  // useQuery to gather Product Form data
  const {
    data: productForm,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product-form", data.id],
    queryFn: () => sdk.client.fetch<{ product_form: ProductFormType }>(`/admin/product-product_form/product/${data.id}`),
    refetchOnMount: "always",
  });

  // useEffect to set Form State
  useEffect(() => {
    if (productForm) {
      const product_form = productForm.product_form;
      const updatedForm: Form = {
        id: product_form.id,
        product_id: product_form.product_id,
        name: product_form.name || undefined,
        active: product_form.active,
        fields: product_form.fields.map((field: ProductFormFieldType) => {
          return {
            id: field.id,
            uuid: field.uuid,
            label: field.label ?? undefined,
            description: field.description ?? undefined,
            placeholder: field.placeholder ?? undefined,
            required: field.required,
            options: field.options ?? undefined,
            input_type: field.input_type,

            max_file_size: field.max_file_size ?? undefined,
            max_images: field.max_images ?? undefined,
            image_ratios: field.image_ratios ?? undefined,

            image: field.image ?? undefined,
          } as Field;
        }),
      };
      setForm(updatedForm);
    }
  }, [productForm]);

  if (isLoading) {
    return (
      <SectionWrapper heading="Product Form">
        <SectionLoader height={160} />
      </SectionWrapper>
    );
  }

  if (error || !productForm) {
    return (
      <SectionWrapper heading="Product Form">
        <SectionText message="ERROR: Failed to retrieve product form." height={160} />
      </SectionWrapper>
    );
  }

  if (!form) {
    <SectionWrapper heading="Product Form">
      <SectionLoader height={160} />
    </SectionWrapper>;
  }

  return (
    <>
      {form ? (
        <SectionWrapper
          heading="Product Form"
          modal={<ProductFormModal productForm={form} product_id={data.id} focusModal={modalOpen} setFocusModal={setModalOpen} />}
        >
          {form && <ProductFormTable form={form} setModalOpen={setModalOpen} />}
        </SectionWrapper>
      ) : (
        <SectionWrapper heading="Product Form">
          <SectionLoader height={160} />
        </SectionWrapper>
      )}
    </>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
});

export default ProductFormWidget;

import { MedusaService } from "@medusajs/framework/utils";
import ProductForm from "./models/product-form";
import ProductFormField from "./models/product-form-field";
import FieldImage from "./models/field-image";

class ProductFormModuleService extends MedusaService({
  ProductForm,
  ProductFormField,
  FieldImage,
}) {}

export default ProductFormModuleService;

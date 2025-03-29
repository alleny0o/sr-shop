import { HttpTypes } from "@medusajs/framework/types";

export type Review = {
    id: string;
    title?: string;
    content: string;
    rating: number;
    product_id: string;
    customer_id?: string;
    status: "pending" | "approved" | "rejected";
    created_at: Date;
    updated_at: Date;
    product?: HttpTypes.AdminProduct;
    customer?: HttpTypes.AdminCustomer;
};
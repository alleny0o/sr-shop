export type ProductFormField = {
    id?: string; 
    uuid: string;

    label?: string;
    description?: string;
    placeholder?: string;
    options?: string[];
    required: boolean;
    input_type: "text" | "textarea" | "dropdown" | "images";

    max_file_size?: number; 
    max_images?: number;
    image_ratios?: string[];

    image?: FieldImage;
};

export type FieldImage = {
    file_id: string;
    name: string;
    size: number;
    mime_type: string;
    url: string;
};
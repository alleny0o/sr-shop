export type Media = {
    id?: string;
    file_id: string;
    product_id: string;
    variant_id: string;
    url: string;
    mime_type: string;
    is_thumbnail: boolean;
    name: string;
    size: number;
    file?: File;
};
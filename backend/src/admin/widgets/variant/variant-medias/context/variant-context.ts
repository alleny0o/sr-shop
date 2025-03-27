import { createContext, useContext } from "react";

export type VariantProductRelation = {
    product_id: string;
    variant_id: string;
};

export const VariantContext = createContext<VariantProductRelation | undefined>(undefined);

export function useVariantContext() {
    const context = useContext(VariantContext);
    
    if (context === undefined) {
        throw new Error("useVariantContext must be used within a VariantContext.Provider");
    };

    return context;
};

VariantContext.displayName = "VariantContext";
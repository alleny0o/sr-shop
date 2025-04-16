"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { HttpTypes } from "@medusajs/types";
import { sdk } from "@lib/config";

type CartContextType = {
    cart: HttpTypes.StoreCart | null;
    setCart: React.Dispatch<React.SetStateAction<HttpTypes.StoreCart | null>>;
    refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

type CartProviderProps = {
    children: React.ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null);
};
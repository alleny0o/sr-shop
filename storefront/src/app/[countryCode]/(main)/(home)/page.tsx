"use client";

import { useCart } from "@/providers/cart";
import React from "react";

export default function Page() {
  const { cart, setCart } = useCart();

  React.useEffect(() => {
    console.log(cart);
  }, [cart]);

  return <div>page.tsx</div>;
}

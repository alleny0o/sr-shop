import { useEffect, useState } from 'react';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';

export interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export function Header({ header, cart, isLoggedIn, publicStoreDomain }: HeaderProps) {
  const { shop, menu } = header;

  return (
    <>
      <div id="announcement-bar" className="bg-pastel-green-medium">
        <div className="max-w-7xl mx-auto text-center py-1.5 px-6">
          <p className="font-inter text-[11px] sm:text-xs font-light tracking-wide">
            Gifts crafted with heart — by Sam & Rachel
          </p>
        </div>
      </div>

      <header id="header" className={`fixed top-0 `}></header>
    </>
  );
}

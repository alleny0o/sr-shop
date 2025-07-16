import { NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';
import { HeaderMenu } from '../header/HeaderMenu';
import { useAside } from '../Aside';
import { HeaderMenuMobileToggle } from '../header/HeaderMenuMobileToggle';
import { SearchToggle } from '../header/SearchToggle';
import { HeaderCtas } from '../header/HeaderCtas';

export interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export function Header({ header, cart, isLoggedIn, publicStoreDomain }: HeaderProps) {
  const { shop, menu } = header;
  const [showBorder, setShowBorder] = useState(false);
  const { type: asideType } = useAside();

  useEffect(() => {
    const handleScroll = () => {
      const announcementBar = document.getElementById('announcement-bar');
      if (announcementBar) {
        const announcementBarHeight = announcementBar.offsetHeight;
        const scrolled = window.scrollY >= announcementBarHeight;
        setShowBorder(scrolled);
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div id="announcement-bar" className="bg-pastel-green-medium">
        <div className="max-w-10xl mx-auto text-center py-1.5 px-4 sm:px-6 lg:px-8">
          <p className="font-inter text-[11px] sm:text-xs font-light tracking-wide">
            Gifts crafted with heart — by Sam & Rachel
          </p>
        </div>
      </div>

      {/* Header */}
      <header id="header" className="sticky top-0 w-full z-40 bg-pastel-yellow-light">
        <div className="max-w-10xl mx-auto">
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-1">
            {/* Left Section */}
            <div className="flex items-center min-w-0 flex-1">
              <div className="flex items-center md:gap-3 sm:gap-2 gap-1.5 lg:hidden">
                <HeaderMenuMobileToggle />
                <SearchToggle />
              </div>
              <div className="hidden lg:flex lg:flex-wrap">
                <HeaderMenu
                  menu={menu}
                  primaryDomainUrl={shop.primaryDomain.url}
                  viewport={asideType === 'mobile' ? 'mobile' : 'desktop'}
                  publicStoreDomain={publicStoreDomain}
                />
              </div>
            </div>

            {/* Center Section */}
            <div className="flex-shrink-0">
              <NavLink to="/" className="block">
                <img src="/media/sr-logo.png" alt="SR Logo" className="h-12 w-auto" />
              </NavLink>
            </div>

            {/* Right Section */}
            <div className="flex items-center justify-end min-w-0 flex-1">
                <HeaderCtas isLoggedIn={isLoggedIn} cart={cart}/>
            </div>
          </div>
        </div>

        {showBorder && <div className="w-full bg-black h-px"></div>}
      </header>
    </>
  );
}

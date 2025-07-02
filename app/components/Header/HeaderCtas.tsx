import { User } from 'lucide-react';
import { CartToggle } from './CartToggle';
import { SearchToggleDesktop } from './SearchToggle';
import type { HeaderProps } from './Header';
import { NavLink } from 'react-router';

type HeaderCtasProps = Pick<HeaderProps, 'isLoggedIn' | 'cart'>;

export function HeaderCtas({ isLoggedIn, cart }: HeaderCtasProps) {
  return (
    <nav className="flex items-center gap-1 sm:gap-2 md:gap-3" role="navigation">
      <SearchToggleDesktop />
      <NavLink prefetch="intent" to="/account" className="p-1 transition-all duration-200" aria-label="Account">
        <User className="w-6 h-6" strokeWidth={1} />
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  );
}

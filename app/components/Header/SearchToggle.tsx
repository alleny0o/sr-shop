import { Search } from 'lucide-react';
import { useAside } from '~/components/Aside';

export function SearchToggle() {
  const { open } = useAside();
  return (
    <button className="p-1 transition-all duration-200 lg:hidden" onClick={() => open('search')} aria-label="Search">
      <Search className="w-6 h-6" strokeWidth={1} />
    </button>
  );
}

export function SearchToggleDesktop() {
  const { open } = useAside();
  return (
    <button
      className="p-1 transition-all duration-200 hidden lg:block"
      onClick={() => open('search')}
      aria-label="Search"
    >
      <Search className="w-6 h-6" strokeWidth={1} />
    </button>
  );
}

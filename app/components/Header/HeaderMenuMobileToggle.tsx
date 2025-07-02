import { Menu } from 'lucide-react';
import { useAside } from '~/components/Aside';

export function HeaderMenuMobileToggle() {
  const { open } = useAside();
  return (
    <button className="p-1 transition-colors duration-200" onClick={() => open('mobile')} aria-label="Open menu">
      <Menu className="w-6 h-6" strokeWidth={1} />
    </button>
  );
}

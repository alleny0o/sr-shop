import type { ReactNode } from 'react';
import type { AsideType } from '../types/aside';
import { X } from 'lucide-react';

interface AsideHeaderProps {
  type: AsideType;
  heading: ReactNode;
  onClose: () => void;
}

export function AsideHeader({ type, heading, onClose }: AsideHeaderProps) {
  if (type === 'closed' || type === 'search') {
    return null;
  }

  return (
    <header className="flex items-center justify-between h-[57px] px-5 border-b border-black">
      <h3 className="font-sans text-xl m-0">{heading}</h3>
      <button
        className="w-5 h-5 font-bold opacity-80 hover:opacity-100 transition-all duration-200 text-xl leading-none border-none bg-inherit cursor-pointer flex items-center justify-center"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </header>
  );
}

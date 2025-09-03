import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface AsideHeaderProps {
  heading: ReactNode;
  onClose: () => void;
}

export function AsideHeader({ heading, onClose }: AsideHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-soft">
      <h3 className="font-inter font-light text-base m-0">{heading}</h3>
      <button
        className="w-5 h-5 font-bold opacity-80 hover:opacity-100 transition-all duration-200 text-xl leading-none border-none bg-inherit cursor-pointer flex items-center justify-center"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-5 h-5" strokeWidth={1.25} />
      </button>
    </header>
  );
}

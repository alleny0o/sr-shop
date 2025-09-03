import { useAsideClose } from '~/components/aside/hooks/useAsideClose';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface CartAsideHeaderProps {
  heading: ReactNode;
}

export const CartAsideHeader = ({ heading }: CartAsideHeaderProps) => {
  const { handleClose } = useAsideClose();
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-soft">
      <h3 className="font-inter font-normal text-lg m-0">{heading}</h3>
      <button
        className="w-5 h-5 font-bold opacity-80 hover:opacity-100 transition-all duration-200 text-xl leading-none border-none bg-inherit cursor-pointer flex items-center justify-center"
        onClick={handleClose}
        aria-label="Close"
      >
        <X className="w-5 h-5" strokeWidth={1.25} />
      </button>
    </header>
  );
};

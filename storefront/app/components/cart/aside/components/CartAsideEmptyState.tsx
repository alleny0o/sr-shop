import { Link } from 'react-router';
import { useAside } from '~/components/aside';
import { ArrowRight } from 'lucide-react';

export const CartAsideEmptyState = () => {
  const { close } = useAside();

  return (
    <div className="h-full flex flex-col justify-center items-center gap-4 p-4 text-sm font-inter">
      <p>Your cart is empty.</p>
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className="flex justify-center items-center gap-1 w-full p-3 bg-primary text-white hover:-translate-y-px transition-transform duration-200"
      >
        <span>Continue shopping</span>
        <ArrowRight size={17} />
      </Link>
    </div>
  );
};

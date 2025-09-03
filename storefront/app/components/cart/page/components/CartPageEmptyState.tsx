import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export const CartPageEmptyState = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-4 py-4 sm:py-6 md:py-8 lg:py-10 px-4">
      {/* Text content */}
      <div className="text-center">
        <h2 className="text-base sm:text-lg md:text-xl font-light text-black tracking-tight">
          Your cart is empty
        </h2>
      </div>

      {/* CTA Button - Responsive sizing */}
      <Link
        to="/collections"
        prefetch="viewport"
        className="text-sm sm:text-base inline-flex justify-center items-center gap-1 px-4 sm:px-6 md:px-8 w-full max-w-xs sm:max-w-sm md:max-w-md py-2 sm:py-3 bg-primary text-white hover:-translate-y-px transition-transform duration-200"
      >
        <span>Continue shopping</span>
        <ArrowRight size={16} className="sm:w-[17px] sm:h-[17px]" />
      </Link>
    </div>
  );
};
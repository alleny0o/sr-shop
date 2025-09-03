import { X } from 'lucide-react';

type CloseButtonProps = {
  onClose?: () => void;
};

export const CloseButton = (props: CloseButtonProps) => {
  return (
    <button
      onClick={props.onClose}
      className="group p-2.25 flex items-center justify-center bg-pastel-yellow-light border border-gray-300 shadow-sm rounded-none cursor-pointer transition-all duration-200"
    >
      <X
        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-all duration-200 group-hover:scale-125 text-black"
        strokeWidth={1.2}
      />
    </button>
  );
};

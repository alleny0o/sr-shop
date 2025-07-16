import React from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  currentIndex: number;
  totalMedia: number;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  currentIndex, 
  totalMedia, 
  onClose 
}) => (
  <div className="absolute top-4 left-6 right-6 z-[1001] flex items-center justify-between">
    <div className="px-4 py-1.5 flex items-center justify-center bg-pastel-yellow-light border border-gray-300 shadow-sm rounded-none">
      <span className="text-xs sm:text-sm md:text-base font-light text-black">
        {currentIndex + 1} / {totalMedia}
      </span>
    </div>

    <button
      onClick={onClose}
      className="group p-2.25 flex items-center justify-center bg-pastel-yellow-light border border-gray-300 shadow-sm rounded-none cursor-pointer transition-all duration-200"
    >
      <X
        className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 transition-all duration-200 group-hover:scale-125 text-black"
        strokeWidth={1.2}
      />
    </button>
  </div>
);
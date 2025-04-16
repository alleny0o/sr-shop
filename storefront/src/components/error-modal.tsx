"use client"

import { X } from "lucide-react"

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  buttonText?: string
  onButtonClick?: () => void
  children?: React.ReactNode
}

/**
 * A minimalistic vintage-style error modal component that is fully reusable
 */
export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = "Error",
  message,
  buttonText,
  onButtonClick,
  children,
}) => {
  if (!isOpen) return null

  // Use onButtonClick if provided, otherwise default to onClose
  const handleButtonClick = onButtonClick || onClose

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black shadow-md max-w-md w-full mx-auto">
        <div className="border-b border-black p-4 flex justify-between items-center bg-gray-100">
          <h3 className="text-lg font-serif">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 font-serif text-center">
          {children || <p>{message}</p>}
        </div>
        <div className="border-t border-black p-4 flex justify-center">
          <button
            onClick={handleButtonClick}
            className="px-6 py-2 bg-black text-white hover:bg-gray-800 font-serif"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

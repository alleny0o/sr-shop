import { useState, useEffect, useCallback } from 'react';

type UseModalProps = {
  mediaCount: number;
  onClose?: () => void;
};

export const useModal = (props: UseModalProps) => {
  const { mediaCount, onClose } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [openedFromScreenSize, setOpenedFromScreenSize] = useState<'mobile' | 'desktop'>('desktop');

  // Handle open modal - accepts the screen size context
  const handleOpen = useCallback((index: number = 0, screenSize: 'mobile' | 'desktop' = 'desktop') => {
    setCurrentIndex(Math.max(0, Math.min(index, mediaCount - 1)));
    setOpenedFromScreenSize(screenSize);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, [mediaCount]);

  // Handle close modal
  const handleClose = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
    onClose?.();
  }, [onClose]);

  // Keyboard navigation - only ESC to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Reset index when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  return {
    isOpen,
    currentIndex,
    openedFromScreenSize,
    handleOpen,
    handleClose,
  };
};
import { useState } from 'react';
import { useAside } from './useAside';

export const useAsideClose = () => {
  const { close: ctxClose } = useAside();
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    ctxClose();
    requestAnimationFrame(() => setClosing(false));
  };

  return { handleClose, closing, setClosing };
};
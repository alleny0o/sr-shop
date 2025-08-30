import { useContext } from 'react';
import { AsideContext } from '../context/AsideContext';

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
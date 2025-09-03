import { createContext, type ReactNode, useState } from 'react';
import type { AsideContextValue, AsideType } from '../types/aside';

export const AsideContext = createContext<AsideContextValue | null>(null);

export function AsideProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
}
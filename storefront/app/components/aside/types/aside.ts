import type { ReactNode } from 'react';

export type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
export type AsidePosition = 'left' | 'right' | 'modal';
export type Breakpoint = 'sm' | 'md' | 'lg';

export type AsideConfig = Partial<Record<Breakpoint, AsidePosition>> & {
  default: AsidePosition;
};

export type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

export interface AsideProps {
  children?: ReactNode;
  type: AsideType;
  heading: ReactNode;
  config: AsideConfig;
}

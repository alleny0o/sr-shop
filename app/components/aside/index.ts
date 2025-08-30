// Import first
import { Aside } from './components/Aside';
import { AsideProvider } from './context/AsideContext';

// Then export
export { Aside } from './components/Aside';
export { AsideProvider } from './context/AsideContext';
export { useAside } from './hooks/useAside';

// Types
export type { 
  AsideType, 
  AsidePosition, 
  AsideConfig, 
  AsideContextValue,
  AsideProps 
} from './types/aside';

export const AsideComponent = Object.assign(Aside, {
  Provider: AsideProvider,
});

export default AsideComponent;
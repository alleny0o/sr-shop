import { useEffect, type ReactNode } from 'react';
import { useAside } from '../hooks/useAside';
import { getAsideClasses, getPositionAtBreakpoint } from '../utils/asideClassNames';
import { AsideBackdrop } from './AsideBackdrop';
import { cn } from '~/utils/cn';
import { useAsideClose } from '../hooks/useAsideClose';

export interface AsideProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  type: string;
  config: {
    default: 'modal' | 'left' | 'right';
    sm?: 'modal' | 'left' | 'right';
    md?: 'modal' | 'left' | 'right';
    lg?: 'modal' | 'left' | 'right';
  };
}

export const Aside = ({ children, header, footer, type, config }: AsideProps) => {
  const { type: activeType, close: ctxClose } = useAside();
  const { handleClose, closing, setClosing } = useAsideClose();

  const expanded = type === activeType;

  useEffect(() => {
    if (!expanded) return;

    const scrollY = window.scrollY;
    const originalStyles = {
      overflow: document.body.style.overflow,
      height: document.body.style.height,
      position: document.body.style.position,
      width: document.body.style.width,
      top: document.body.style.top,
    };

    Object.assign(document.body.style, {
      overflow: 'hidden',
      height: '100vh',
      position: 'fixed',
      width: '100%',
      top: `-${scrollY}px`,
    });

    return () => {
      Object.assign(document.body.style, originalStyles);
      window.scrollTo(0, scrollY);
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;

    const abortController = new AbortController();

    document.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleClose();
        }
      },
      { signal: abortController.signal },
    );

    return () => abortController.abort();
  }, [expanded, handleClose]);

  const { mobilePosition } = getPositionAtBreakpoint(config);
  const isModal = mobilePosition === 'modal';

  return (
    <div
      aria-modal
      className={cn(
        'fixed inset-0 z-[1000]',
        // Only add opacity transition for modal positions
        isModal && !closing && 'transition-opacity duration-300',
        closing && '!transition-none',
        expanded ? 'pointer-events-auto visible' : 'pointer-events-none invisible',
        // Only fade parent container for modals - side panels handle their own opacity
        isModal ? (expanded ? 'opacity-100' : 'opacity-0') : 'opacity-100', // Side panels: parent always visible, aside handles slide animation
      )}
      role="dialog"
    >
      <AsideBackdrop onClose={handleClose} />

      <aside className={cn(getAsideClasses(config, expanded, closing), 'flex flex-col')}>
        {/* Header */}
        {header && (
          <div className="flex-shrink-0">{header}</div>
        )}

        {/* Main content - scrollable */}
        <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>

        {/* Footer - optional, fixed at bottom */}
        {footer && <div className="flex-shrink-0">{footer}</div>}
      </aside>
    </div>
  );
}

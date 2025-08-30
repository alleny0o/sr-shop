import { useEffect, useState } from 'react';
import { AsideProps } from '../types/aside';
import { useAside } from '../hooks/useAside';
import { getAsideClasses, getPositionAtBreakpoint } from '../utils/asideClassNames';
import { AsideBackdrop } from './AsideBackdrop';
import { AsideHeader } from './AsideHeader';
import { cn } from '~/utils/cn';

export function Aside({ children, heading, type, config }: AsideProps) {
  const { type: activeType, close: ctxClose } = useAside();
  const expanded = type === activeType;
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    ctxClose();
    requestAnimationFrame(() => setClosing(false));
  };

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

      <aside className={getAsideClasses(config, expanded, closing)} style={{ backgroundColor: 'white' }}>
        <AsideHeader type={type} heading={heading} onClose={handleClose} />
        <main className="m-4">{children}</main>
      </aside>
    </div>
  );
}

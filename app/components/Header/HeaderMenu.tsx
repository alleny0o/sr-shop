import { HeaderQuery } from 'storefrontapi.generated';
import { useAside } from '../Aside';
import { NavLink } from 'react-router';

export type Viewport = 'desktop' | 'mobile';

type HeaderMenuProps = {
  menu: HeaderQuery['menu'];
  primaryDomainUrl: string;
  viewport: Viewport;
  publicStoreDomain: string;
};

export function HeaderMenu({ menu, primaryDomainUrl, viewport, publicStoreDomain }: HeaderMenuProps) {
  const { close } = useAside();

  if (!menu) return null;

  const normalizeUrl = (url: string) => {
    if (!url) return '/';
    const isFullUrl =
      url.includes('myshopify.com') || url.includes(publicStoreDomain) || url.includes(primaryDomainUrl);

    let cleanUrl = isFullUrl ? new URL(url).pathname : url;
    cleanUrl = cleanUrl.replace(/\/$/, '') || '/';

    return cleanUrl;
  };

  if (viewport === 'mobile') {
    return (
      <>
        {menu.items.map(item => {
          if (!item.url) return null;
          const url = normalizeUrl(item.url);

          return (
            <NavLink className="header-menu-item" end key={item.id} onClick={close} prefetch="intent" to={url}>
              {item.title}
            </NavLink>
          );
        })}
      </>
    );
  }

  return (
    <nav className="flex items-center space-x-6" role="navigation">
        {menu.items.map(item => {
            if (!item.url) return null;
            const url = normalizeUrl(item.url);

            return (
                <NavLink 
                    key={item.id} 
                    to={url} 
                    prefetch="intent"
                    className="header-menu-item font-inter text-sm font-light"
                >
                    {item.title}
                </NavLink>
            )
        })}
    </nav>
  )
}

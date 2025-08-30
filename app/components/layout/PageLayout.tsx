import { Await, Link } from 'react-router';
import { Suspense, useId } from 'react';
import type { CartApiQueryFragment, FooterQuery, HeaderQuery } from 'storefrontapi.generated';
import { AsideComponent } from '~/components/aside';
import { Footer } from '~/components/footer/Footer';
import { Header } from '~/components/header/Header';
import { CartMain } from '../cart/CartMain';
import { HeaderMenu } from '~/components/header/HeaderMenu';
import { SEARCH_ENDPOINT, SearchFormPredictive } from '~/components/SearchFormPredictive';
import { SearchResultsPredictive } from '~/components/SearchResultsPredictive';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({ cart, children = null, footer, header, isLoggedIn, publicStoreDomain }: PageLayoutProps) {
  return (
    <AsideComponent.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && <Header header={header} cart={cart} isLoggedIn={isLoggedIn} publicStoreDomain={publicStoreDomain} />}
      <main>{children}</main>
      <Footer footer={footer} header={header} publicStoreDomain={publicStoreDomain} />
    </AsideComponent.Provider>
  );
}

function CartAside({ cart }: { cart: PageLayoutProps['cart'] }) {
  return (
    <AsideComponent
      type="cart"
      heading="CART"
      config={{
        default: 'right',
      }}
    >
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {cart => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </AsideComponent>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <AsideComponent
      type="search"
      heading="SEARCH"
      config={{
        default: 'left',
        lg: 'right',
      }}
    >
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({ fetchResults, goToSearch, inputRef }) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
              />
              &nbsp;
              <button onClick={goToSearch}>Search</button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({ items, total, term, state, closeSearch }) => {
            const { articles, collections, pages, products, queries } = items;

            if (state === 'loading' && term.current) {
              return <div>Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries queries={queries} queriesDatalistId={queriesDatalistId} />
                <SearchResultsPredictive.Products products={products} closeSearch={closeSearch} term={term} />
                <SearchResultsPredictive.Collections collections={collections} closeSearch={closeSearch} term={term} />
                <SearchResultsPredictive.Pages pages={pages} closeSearch={closeSearch} term={term} />
                <SearchResultsPredictive.Articles articles={articles} closeSearch={closeSearch} term={term} />
                {term.current && total ? (
                  <Link onClick={closeSearch} to={`${SEARCH_ENDPOINT}?q=${term.current}`}>
                    <p>
                      View all results for <q>{term.current}</q>
                      &nbsp; →
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </AsideComponent>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <AsideComponent
        type="mobile"
        heading="MENU"
        config={{
          default: 'left',
        }}
      >
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </AsideComponent>
    )
  );
}

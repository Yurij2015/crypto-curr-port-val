import { ReactNode, useState, useEffect } from "react";
import Head from "next/head";
import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const Layout = ({
  children,
  dehydratedState,
}: {
  children: ReactNode;
  dehydratedState: DehydratedState;
}) => {
  const [queryClient] = useState(() => new QueryClient());
  const [themeKey, setThemeKey] = useState(0); // Force re-render

  useEffect(() => {
    // Watch for dark class changes
    const html = document.documentElement;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setThemeKey(prev => prev + 1); // Force re-render
        }
      });
    });

    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Cryptocurrency portfolio valuation and hourly history"
        />
        <meta property="og:title" content="Crypto Portfolio Valuation" />
        <meta
          property="og:description"
          content="Hourly portfolio valuation (USDT) with historical snapshots"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crypto-curr.digispace.pro/" />
        <meta property="og:image" content="/api-platform/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Crypto Portfolio Valuation" />
        <meta
          name="twitter:description"
          content="Hourly portfolio valuation (USDT) with historical snapshots"
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            {children}
          </div>
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  );
};

export default Layout;

import Head from "next/head";
import React, { useState, useEffect } from "react";
import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import { AcademicCapIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ThemeToggle from "../components/common/ThemeToggle";

const Welcome = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial dark mode state
    setIsDark(document.documentElement.classList.contains("dark"));

    // Watch for changes to the dark class
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains("dark"));
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      style={{
        backgroundColor: isDark ? '#111827' : '#f8f9fb',
        color: isDark ? '#f3f4f6' : '#1f2937',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        backgroundImage: isDark 
          ? 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)'
          : 'linear-gradient(135deg, #f0f4f8 0%, #f8f9fb 50%, #f0f7ff 100%)',
      }}
      className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-white flex flex-col justify-between font-[Poppins,sans-serif]"
    >
      <Head>
        <title>Crypto Portfolio - Track Your Holdings</title>
        <meta 
          name="description" 
          content="Real-time cryptocurrency portfolio tracker with hourly history snapshots. Monitor your digital assets and track historical valuations." 
        />
        <meta 
          property="og:title" 
          content="Crypto Portfolio - Track Your Holdings" 
        />
        <meta 
          property="og:description" 
          content="Real-time cryptocurrency portfolio tracker with hourly history snapshots. Monitor your digital assets and track historical valuations." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crypto-curr.digispace.pro/" />
        <meta property="og:image" content="/api-platform/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Crypto Portfolio" />
        <meta 
          name="twitter:description" 
          content="Hourly portfolio valuation tracker with historical snapshots" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header 
        style={{
          backgroundColor: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          borderBottomColor: isDark ? '#374151' : '#e0e7ff',
          borderBottomWidth: '1px',
          boxShadow: isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
        className="w-full bg-white/80 shadow-sm py-4 px-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <AcademicCapIcon 
            style={{
              color: isDark ? '#22d3ee' : '#0891b2'
            }}
            className="w-8 h-8 text-cyan-600" 
          />
          <span 
            style={{
              color: isDark ? '#06e4ff' : '#0a7ea4',
              fontWeight: 'bold',
            }}
            className="font-bold text-lg sm:text-2xl text-cyan-700 tracking-tight"
          >
            Crypto Portfolio
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <ul className="hidden sm:flex gap-4">
            <li>
              <Link
                href="/admin"
                style={{
                  color: isDark ? '#d1d5db' : '#374151',
                }}
                className="flex items-center px-3 py-1 rounded hover:bg-blue-100 transition-colors font-medium text-gray-700"
              >
                Portfolio History
              </Link>
            </li>
            <li>
              <Link
                href="/"
                style={{
                  color: isDark ? '#d1d5db' : '#374151',
                  backgroundColor: isDark ? 'rgba(34, 211, 238, 0.1)' : '#f0f9ff',
                  borderRadius: '0.375rem',
                  padding: '0.25rem 0.75rem',
                }}
                className="flex items-center px-3 py-1 rounded hover:bg-blue-100 transition-colors font-medium text-gray-700"
              >
                Home
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </nav>
      </header>
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col items-center justify-center">
        <section className="w-full py-12 sm:py-20 flex items-center justify-center">
          <div 
            style={{
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.6)' : '#ffffff',
              borderColor: isDark ? '#374151' : '#e0e7ff',
            }}
            className="bg-white/80 rounded-xl shadow-lg p-6 sm:p-10 max-w-xl w-full text-center"
          >
            <h1 
              style={{
                color: isDark ? '#bfdbfe' : '#1e40af',
              }}
              className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4"
            >
              Welcome to Crypto Portfolio
            </h1>
            <p 
              style={{
                color: isDark ? '#d1d5db' : '#4b5563',
              }}
              className="text-gray-700 mb-8 text-base sm:text-lg"
            >
              Track your cryptocurrency holdings with real-time updates.
              <br />
              View your portfolio value and historical snapshots.
            </p>
            <Link
              href="/admin"
              style={{
                background: isDark 
                  ? 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)'
                  : 'linear-gradient(135deg, #0891b2 0%, #0a7ea4 100%)',
                color: '#ffffff',
                padding: '0.5rem 1.5rem',
                paddingBottom: '0.75rem',
                paddingTop: '0.75rem',
                borderRadius: '9999px',
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                display: 'inline-block',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-bold text-base sm:text-lg shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              Go to Portfolio
            </Link>
          </div>
        </section>
        <section 
          style={{
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.4)' : '#ffffff',
          }}
          className="bg-white py-8 sm:py-12 w-full rounded-xl"
        >
          <div className="container mx-auto px-4">
            <h2 
              style={{
                color: isDark ? '#bfdbfe' : '#1e40af',
              }}
              className="text-xl sm:text-2xl font-bold text-blue-700 mb-6 sm:mb-8 text-center"
            >
              Available Services
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-8 justify-center">
              <Card
                title="Portfolio Dashboard"
                description="View and track your portfolio value and history"
                url="/admin"
                isDark={isDark}
                icon={<AcademicCapIcon className="w-8 h-8 text-cyan-500" />}
              />
              <Card
                title="API Documentation"
                description="RESTful API for portfolio data access"
                url="/docs"
                isDark={isDark}
                icon={<DocumentTextIcon className="w-8 h-8 text-blue-500" />}
              />
            </div>
          </div>
        </section>
      </main>
      <footer 
        style={{
          backgroundColor: isDark ? 'rgba(17, 24, 39, 0.6)' : 'rgba(248, 249, 251, 0.8)',
          color: isDark ? '#9ca3af' : '#6b7280',
          borderTopColor: isDark ? '#374151' : '#e0e7ff',
          borderTopWidth: '1px',
        }}
        className="w-full py-4 bg-white/80 text-center text-gray-400 text-sm"
      >
        &copy; {new Date().getFullYear()} Crypto Portfolio. All rights reserved.
      </footer>
    </div>
  );
};

export default Welcome;

const Card = ({
  url,
  title,
  description,
  icon,
  isDark,
}: {
  url: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isDark: boolean;
}) => (
  <Link
    href={url}
    style={{
      backgroundColor: isDark 
        ? '#1f2937' 
        : '#f0f9ff',
      backgroundImage: isDark 
        ? 'none'
        : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      borderColor: isDark ? '#0a5f66' : '#06b6d4',
      borderWidth: '2px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    }}
    className="w-full sm:w-64 h-auto sm:h-40 rounded-xl shadow flex flex-col items-center justify-center gap-3 p-4 sm:p-6 border border-cyan-100 hover:border-cyan-400 transition-all group hover:shadow-lg"
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = isDark ? '#22d3ee' : '#0891b2';
      e.currentTarget.style.boxShadow = isDark 
        ? '0 20px 25px -5px rgba(34, 211, 238, 0.2)' 
        : '0 20px 25px -5px rgba(8, 145, 178, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = isDark ? '#0a5f66' : '#06b6d4';
      e.currentTarget.style.boxShadow = '0 1px 2px 0px rgba(0, 0, 0, 0.05)';
    }}
  >
    <div className="group-hover:scale-110 transition-transform">{icon}</div>
    <h3 
      style={{
        color: isDark ? '#0891b2' : '#0a7ea4',
        fontWeight: '600',
        fontSize: '1rem',
      }}
      className="text-lg font-semibold text-cyan-700 group-hover:text-blue-700 text-center"
    >
      {title}
    </h3>
    <p 
      style={{
        color: isDark ? '#9ca3af' : '#4b5563',
        fontSize: '0.875rem',
      }}
      className="text-gray-600 text-center text-sm"
    >
      {description}
    </p>
  </Link>
);

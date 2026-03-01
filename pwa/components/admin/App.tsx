import axios from "axios";
import { useEffect, useState } from "react";
import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "../common/ThemeToggle";
import Link from "next/link";

const menu = [
  {
    name: "Portfolio History",
    href: "/admin",
    current: true,
  },
  { name: "Home", href: "/", current: false },
];

const formatAmount = (v: number | string) => {
  const num = typeof v === "string" ? parseFloat(v) : v;
  if (Number.isNaN(num)) return v;
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

const App = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Watch for dark class changes on html element
    const html = document.documentElement;
    const checkDark = () => {
      const hasDark = html.classList.contains("dark");
      setIsDark(hasDark);
    };

    // Check initial state
    checkDark();

    const observer = new MutationObserver(() => {
      checkDark();
    });

    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Polling: fetch initial data and then every minute
    const POLL_MS = 60_000; // 1 minute

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/portfolio/history?hours=24", { headers: { Accept: "application/json" } });
        const data = Array.isArray(res.data)
          ? res.data.map((i: any) => ({ ...i, amount_usdt: Number(i.amount_usdt) }))
          : [];
        setHistory(data);
        setLastUpdated(new Date());
      } catch (err) {
        // keep previous data, log for debugging
        // eslint-disable-next-line no-console
        console.error("Failed to fetch portfolio history", err);
      } finally {
        setLoading(false);
      }
    };

    // initial fetch
    fetchHistory();

    const id = setInterval(fetchHistory, POLL_MS);
    return () => clearInterval(id);
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
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col font-[Poppins,sans-serif] text-gray-800 dark:text-gray-100"
    >
      <header 
        style={{
          backgroundColor: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          borderBottomColor: isDark ? '#374151' : '#e0e7ff',
          borderBottomWidth: '1px',
          boxShadow: isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
        className="w-full bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm shadow-sm py-3 px-4 sm:px-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <AcademicCapIcon 
            style={{
              color: isDark ? '#22d3ee' : '#0891b2'
            }}
            className="w-8 h-8 text-cyan-600 dark:text-cyan-400" 
          />
          <span 
            style={{
              color: isDark ? '#06e4ff' : '#0a7ea4',
              fontWeight: 'bold',
            }}
            className="font-bold text-lg sm:text-2xl text-cyan-700 dark:text-cyan-300 tracking-tight"
          >
            Crypto Portfolio
          </span>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div 
              style={{
                color: isDark ? '#d1d5db' : '#374151',
              }}
              className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 mr-4"
            >
              Last update: <span style={{ fontFamily: 'monospace', color: isDark ? '#9ca3af' : '#6b7280' }} className="font-mono">{lastUpdated.toISOString()}</span>
              {loading && <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }} className="ml-2 text-xs text-gray-500 dark:text-gray-400">Updating…</span>}
            </div>
          )}
          <nav className="hidden sm:flex gap-4">
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  backgroundColor: item.current 
                    ? (isDark ? 'rgba(34, 211, 238, 0.1)' : '#f0f9ff')
                    : 'transparent',
                  color: item.current
                    ? (isDark ? '#22d3ee' : '#0a7ea4')
                    : (isDark ? '#d1d5db' : '#374151'),
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                className={`flex items-center px-3 py-1 rounded-md transition-colors text-sm font-medium ${
                  item.current
                    ? "bg-cyan-100 text-cyan-900 dark:bg-cyan-900/30 dark:text-cyan-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4 w-full flex-1">
        <section className="w-full py-6">
          <div 
            style={{
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.6)' : '#ffffff',
              borderColor: isDark ? '#374151' : '#e0e7ff',
            }}
            className="bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm p-6 md:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div>
                <h1 
                  style={{
                    color: isDark ? '#bfdbfe' : '#1e40af',
                  }}
                  className="text-2xl sm:text-3xl font-bold text-blue-800 dark:text-blue-200"
                >
                  Portfolio Value History
                </h1>
                <p 
                  style={{
                    color: isDark ? '#d1d5db' : '#4b5563',
                  }}
                  className="text-sm text-gray-600 dark:text-gray-300 mt-1"
                >
                  Hourly portfolio value (USDT). Auto-updates when snapshot runs.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  style={{
                    backgroundColor: isDark ? 'rgba(34, 211, 238, 0.1)' : '#f0f9ff',
                    color: isDark ? '#22d3ee' : '#0a7ea4',
                  }}
                  className="text-sm px-3 py-2 rounded-md bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-200"
                >
                  Go Home
                </Link>
              </div>
            </div>

            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={isDark ? "#374151" : "#e5e7eb"}
                    strokeOpacity={0.6} 
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12, fill: isDark ? "#d1d5db" : "#6b7280" }}
                    minTickGap={20}
                    tickFormatter={(t) => new Date(t).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: isDark ? "#d1d5db" : "#6b7280" }} 
                    domain={["auto", "auto"]} 
                    tickFormatter={(v) => String(formatAmount(v))} 
                  />
                  <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                    formatter={(value: any) => formatAmount(value)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount_usdt" 
                    stroke={isDark ? "#22d3ee" : "#06b6d4"} 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div 
            style={{
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.6)' : '#ffffff',
              borderColor: isDark ? '#374151' : '#e0e7ff',
            }}
            className="bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm p-4"
          >
            <h2 
              style={{
                color: isDark ? '#bfdbfe' : '#1e40af',
              }}
              className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-3"
            >
              Raw Data
            </h2>
            <div className="overflow-x-auto">
              <ul 
                style={{
                  borderColor: isDark ? '#374151' : '#e5e7eb',
                }}
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                {history.length === 0 && (
                  <li 
                    style={{
                      color: isDark ? '#9ca3af' : '#9ca3af',
                    }}
                    className="py-3 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No data yet
                  </li>
                )}
                {history.map((item: any, idx: number) => (
                  <li key={idx} className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span 
                      style={{
                        color: isDark ? '#d1d5db' : '#4b5563',
                      }}
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      {new Date(item.time).toISOString()}
                    </span>
                    <span 
                      style={{
                        color: isDark ? '#93e5ff' : '#1e40af',
                        fontFamily: 'monospace',
                      }}
                      className="font-mono text-blue-700 dark:text-blue-300"
                    >
                      {formatAmount(item.amount_usdt)}
                    </span>
                  </li>
                ))}
              </ul>
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
        className="w-full py-4 bg-white/60 dark:bg-gray-900/60 text-center text-gray-500 dark:text-gray-400 text-sm"
      >
        &copy; {new Date().getFullYear()} Crypto Portfolio. All rights reserved.
      </footer>
    </div>
  );
};

export default App;

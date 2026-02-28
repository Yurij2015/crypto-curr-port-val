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
import { AcademicCapIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const menu = [
  {
    name: "Portfolio History",
    href: "/admin",
    current: true,
    icon: <AcademicCapIcon className="w-5 h-5 mr-2 text-cyan-600" />,
  },
  { name: "Home", href: "/", current: false, icon: null },
];

const App = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get("/api/portfolio/history")
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-white flex flex-col justify-between font-[Poppins,sans-serif]">
      <header className="w-full bg-white/80 shadow-sm py-4 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AcademicCapIcon className="w-8 h-8 text-cyan-600" />
          <span className="font-bold text-2xl text-cyan-700 tracking-tight">
            Crypto Portfolio
          </span>
        </div>
        <nav>
          <ul className="flex gap-4">
            {menu.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-1 rounded hover:bg-blue-100 transition-colors font-medium ${
                    item.current
                      ? "bg-blue-200 text-blue-900"
                      : "text-gray-700"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="max-w-3xl mx-auto py-8 px-4 w-full">
        <section className="w-full py-10 flex items-center justify-center">
          <div className="bg-white/80 rounded-xl shadow-lg p-10 max-w-xl w-full text-center">
            <h1 className="text-3xl font-bold text-blue-800 mb-4">
              Portfolio Value History
            </h1>
            <p className="text-gray-700 mb-8 text-lg">
              View your hourly portfolio value as a chart and raw data below.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={history}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  minTickGap={20}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  formatter={(value: any) => value.toLocaleString()}
                  labelFormatter={undefined}
                />
                <Line
                  type="monotone"
                  dataKey="amount_usdt"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="bg-white py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">
              Raw Data
            </h2>
            <ul className="divide-y divide-gray-200 max-w-xl mx-auto">
              {history.map((item: any, idx: number) => (
                <li
                  key={idx}
                  className="py-2 flex justify-between text-sm"
                >
                  <span className="text-gray-600">{item.time}</span>
                  <span className="font-mono text-blue-700">
                    {item.amount_usdt}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <footer className="w-full py-4 bg-white/80 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Crypto Portfolio. All rights reserved.
      </footer>
    </div>
  );
};

export default App;

const Card = ({
  url,
  title,
  icon,
}: {
  url: string;
  title: string;
  icon: React.ReactNode;
}) => (
  <Link
    href={url}
    className="w-64 h-32 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl shadow flex flex-col items-center justify-center gap-3 border border-cyan-100 hover:border-cyan-400 transition-colors group"
  >
    <div className="group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-lg font-semibold text-cyan-700 group-hover:text-blue-700">
      {title}
    </h3>
  </Link>
);

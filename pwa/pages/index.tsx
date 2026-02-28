import Head from "next/head";
import React from "react";
import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import { AcademicCapIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const Welcome = () => (
  <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-white flex flex-col justify-between font-[Poppins,sans-serif]">
    <Head>
      <title>Welcome to Crypto Portfolio!</title>
    </Head>
    <header className="w-full bg-white/80 shadow-sm py-4 px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AcademicCapIcon className="w-8 h-8 text-cyan-600" />
        <span className="font-bold text-2xl text-cyan-700 tracking-tight">
          Crypto Portfolio
        </span>
      </div>
      <nav>
        <ul className="flex gap-4">
          <li>
            <Link
              href="/admin"
              className="flex items-center px-3 py-1 rounded hover:bg-blue-100 transition-colors font-medium text-gray-700"
            >
              Portfolio History
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="flex items-center px-3 py-1 rounded hover:bg-blue-100 transition-colors font-medium text-gray-700"
            >
              Home
            </Link>
          </li>
        </ul>
      </nav>
    </header>
    <main className="max-w-3xl mx-auto py-8 px-4 w-full">
      <section className="w-full py-20 flex items-center justify-center">
        <div className="bg-white/80 rounded-xl shadow-lg p-10 max-w-xl w-full text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">
            Welcome to Crypto Portfolio
          </h1>
          <p className="text-gray-700 mb-8 text-lg">
            This container hosts your <b>Next.js</b> application.
            <br />
            Here you can view your portfolio and its history.
          </p>
          <Link
            href="/admin"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-transform hover:scale-105 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            Go to Admin
          </Link>
        </div>
      </section>
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">
            Available services
          </h2>
          <div className="flex flex-wrap gap-8 justify-center">
            <Card
              title="Portfolio Admin"
              url="/admin"
              icon={<AcademicCapIcon className="w-8 h-8 text-cyan-500" />}
            />
            <Card
              title="API Docs"
              url="/docs"
              icon={<DocumentTextIcon className="w-8 h-8 text-blue-500" />}
            />
          </div>
        </div>
      </section>
    </main>
    <footer className="w-full py-4 bg-white/80 text-center text-gray-400 text-sm">
      &copy; {new Date().getFullYear()} Crypto Portfolio. All rights reserved.
    </footer>
  </div>
);
export default Welcome;

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

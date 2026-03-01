import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Check current theme after mount
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggle = () => {
    const hadDark = document.documentElement.classList.contains("dark");
    const newDark = !hadDark;
    
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    setDark(newDark);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      style={{
        backgroundColor: dark ? '#374151' : '#e5e7eb',
        padding: '0.5rem',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
      }}
      className={`${className} p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer`}
      aria-label="Toggle theme"
    >
      {dark ? (
        <SunIcon style={{ color: '#fbbf24' }} className="w-5 h-5 text-yellow-500" />
      ) : (
        <MoonIcon style={{ color: '#64748b' }} className="w-5 h-5 text-slate-700" />
      )}
    </button>
  );
};

export default ThemeToggle;


"use client";
import Link from "next/link";
const MainHeader = () => {
  return (
    <header className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="text-2xl font-bold tracking-tight">GitFeed</div>

      {/* ナビゲーション */}
      <nav className="flex gap-6">
        <Link href="/feed" className="hover:text-gray-400 transition-colors">
          Feed
        </Link>
        <Link
          href="/settings"
          className="hover:text-gray-400 transition-colors"
        >
          settings
        </Link>
      </nav>
    </header>
  );
};
export default MainHeader;

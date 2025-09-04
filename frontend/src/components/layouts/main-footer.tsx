"use client";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const MainFooter = () => {
  return (
    <footer className="bg-black text-white py-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ブランド */}
        <div>
          <div className="text-2xl font-bold mb-2">GitFeed</div>
          <p className="text-gray-400 text-xs">
            GitHubからあなたの興味に合わせたフィードを提供します。
          </p>
        </div>

        {/* ナビゲーション */}
        <div>
          <h3 className="font-semibold mb-2">リンク</h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/feed"
                className="hover:text-gray-400 transition-colors"
              >
                Feed
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="hover:text-gray-400 transition-colors"
              >
                Settings
              </Link>
            </li>
          </ul>
        </div>

        {/* ソーシャル */}
        <div>
          <div className="justify-end items-center flex-col gap-4">
            <h3 className="font-semibold mb-2">Follow us</h3>
            <Link
              href="https://github.com/tsukuneA1/hackathon_w_app"
              target="_blank"
              className="hover:text-gray-400"
            >
              <FaGithub size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} GitFeed. All rights reserved.
      </div>
    </footer>
  );
};

export default MainFooter;

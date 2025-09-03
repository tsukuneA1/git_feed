"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

const Home = () => {
  const { user, isLoading, isAuthenticated, logout } = useAuthStore();

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 px-4 text-center">
      <h1 className="text-3xl font-bold">ホームページ</h1>

      {isAuthenticated && user ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              認証成功！ 🎉
            </h2>
            <div className="text-green-700 flex flex-col items-center">
              <p>
                <strong>ユーザー名:</strong> {user.username}
              </p>
              {user.name && (
                <p>
                  <strong>名前:</strong> {user.name}
                </p>
              )}
              {user.avatar_url && (
                <Image
                  src={user.avatar_url}
                  alt="User Avatar"
                  width={100}
                  height={100}
                  className="rounded-full mt-2"
                />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Button onClick={logout} variant="outline" className="w-full">
              ログアウト
            </Button>
            <Link href="/feed">
              <Button className="w-full">フィードページへ</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">ログインしていません</p>
          <Link href="/signin">
            <Button className="w-full">サインインページへ</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;

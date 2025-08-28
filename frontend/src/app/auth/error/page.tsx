import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">認証エラー</h1>
        <p className="text-gray-600">
          GitHubでの認証に失敗しました。再度お試しください。
        </p>
        <Link
          href="/signin"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          サインインページに戻る
        </Link>
      </div>
    </div>
  );
}

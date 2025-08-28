"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export const SigninHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");

      if (accessToken && refreshToken) {
        try {
          await login(accessToken, refreshToken);
          router.replace("/");
        } catch (error) {
          console.error("Login failed:", error);
          router.replace("/signin");
        }
      } else {
        router.replace("/signin");
      }
    };

    handleAuthSuccess();
  }, [searchParams, login, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">認証処理中...</p>
      </div>
    </div>
  );
};

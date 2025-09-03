"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export const AuthInitializer = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return null;
};

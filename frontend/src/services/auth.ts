import type {
  LogoutRequest,
  RefreshTokenRequest,
  User,
} from "@/lib/api/generated";
import { logout as logoutAPI, refreshToken } from "@/lib/api/generated";
import type { ApiError, Result } from "@/types/result";
import { error, success } from "@/types/result";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const getTokens = (): AuthTokens | null => {
  if (typeof window === "undefined") return null;

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
};

export const setTokens = (tokens: AuthTokens): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

export const clearTokens = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const tokens = getTokens();
  if (!tokens) return null;

  try {
    const request: RefreshTokenRequest = {
      refresh_token: tokens.refreshToken,
    };

    const response = await refreshToken(request);
    const newAccessToken = response.access_token;

    setTokens({
      accessToken: newAccessToken,
      refreshToken: tokens.refreshToken,
    });

    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearTokens();
    return null;
  }
};

export const logout = async (): Promise<void> => {
  const tokens = getTokens();

  if (tokens) {
    try {
      const request: LogoutRequest = {
        refresh_token: tokens.refreshToken,
      };

      await logoutAPI(request);
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  }

  clearTokens();
  window.location.href = "/signin";
};

export const isAuthenticated = (): boolean => {
  return getTokens() !== null;
};

export const getCurrentUserData = async (): Promise<Result<User, ApiError>> => {
  const tokens = getTokens();

  if (!tokens) {
    return error({
      status: 401,
      message: "No authentication tokens available",
      code: "NO_TOKENS",
    });
  }

  try {
    const { AXIOS_INSTANCE } = await import("@/lib/api/mutator");

    const response = await AXIOS_INSTANCE.get("/api/v1/me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    return success(response.data);
  } catch (err) {
    const apiError = err as {
      response?: { status: number; data?: { message?: string } };
    };

    if (apiError?.response?.status === 401) {
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        try {
          const { AXIOS_INSTANCE } = await import("@/lib/api/mutator");

          const response = await AXIOS_INSTANCE.get("/api/v1/me", {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          return success(response.data);
        } catch (retryErr) {
          const retryError = retryErr as {
            response?: { status: number; data?: { message?: string } };
          };
          return error({
            status: retryError?.response?.status || 500,
            message:
              retryError?.response?.data?.message ||
              "Failed to fetch user data after token refresh",
            code: "RETRY_FAILED",
          });
        }
      } else {
        window.location.href = "/signin";
        return error({
          status: 401,
          message: "Authentication failed",
          code: "AUTH_FAILED",
        });
      }
    }

    return error({
      status: apiError?.response?.status || 500,
      message: apiError?.response?.data?.message || "Failed to fetch user data",
      code: "FETCH_FAILED",
    });
  }
};

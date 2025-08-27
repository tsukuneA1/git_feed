const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
}

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
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: tokens.refreshToken,
      }),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data: TokenResponse = await response.json();

    setTokens({
      accessToken: data.access_token,
      refreshToken: tokens.refreshToken, // Keep existing refresh token
    });

    return data.access_token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearTokens();
    return null;
  }
};

export const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const tokens = getTokens();

  if (!tokens) {
    throw new Error("No authentication tokens available");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${tokens.accessToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      const retryHeaders = {
        ...options.headers,
        Authorization: `Bearer ${newAccessToken}`,
        "Content-Type": "application/json",
      };

      return fetch(url, {
        ...options,
        headers: retryHeaders,
      });
    } else {
      // Refresh failed, redirect to login
      window.location.href = "/signin";
      throw new Error("Authentication failed");
    }
  }

  return response;
};

export const logout = async (): Promise<void> => {
  const tokens = getTokens();

  if (tokens) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: tokens.refreshToken,
        }),
      });
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

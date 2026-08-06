import axios from "axios";
import type { RefreshResponse } from "@/core/types/auth";

/**
 * Central Axios instance for all API communication.
 *
 * Key behaviors:
 * - Attaches the access token (from in-memory store) to every request
 * - On 401 responses, attempts a single token refresh before failing
 * - Sends credentials (httpOnly cookies) for cross-origin requests
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for httpOnly refresh token cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
// In-memory access token storage
// ---------------------------------------------------------------------------
// Stored here (not in localStorage) to prevent XSS exposure.
// The tradeoff: a full page refresh requires a /auth/refresh call.

let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

// ---------------------------------------------------------------------------
// Request Interceptor — Attach Bearer token
// ---------------------------------------------------------------------------

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// Response Interceptor — Auto-refresh on 401
// ---------------------------------------------------------------------------

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

/**
 * Processes the queue of requests that were waiting for a token refresh.
 */
const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh for 401 errors, and not for auth endpoints themselves
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/refresh") ||
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/signup");

    if (error.response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Attempt to refresh the token
      const { data } = await axios.post<RefreshResponse>(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      const newToken = data.token;
      setAccessToken(newToken);
      processQueue(null, newToken);

      // Retry the original request with the new token
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      setAccessToken(null);

      // Redirect to login if refresh fails (session expired)
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;

import api from "./api";
import type { AuthResponse, MeResponse, RefreshResponse } from "@/core/types/auth";

/**
 * Typed API functions for authentication endpoints.
 * Each function maps to a backend route in authRoutes.ts.
 */

// ---------------------------------------------------------------------------
// Payload types (what the frontend sends)
// ---------------------------------------------------------------------------

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  email: string;
  password: string;
  nickname?: string;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * POST /auth/login
 * Authenticates a user with email and password.
 */
export const loginApi = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

/**
 * POST /auth/signup
 * Registers a new user.
 * Note: The frontend form uses "fullName" but the backend expects "nickname".
 * The mapping is handled by the store action, not here.
 */
export const signupApi = async (data: SignupPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/signup", data);
  return response.data;
};

/**
 * POST /auth/refresh
 * Rotates the refresh token (sent via httpOnly cookie) and returns a new access token.
 */
export const refreshApi = async (): Promise<RefreshResponse> => {
  const response = await api.post<RefreshResponse>("/auth/refresh");
  return response.data;
};

/**
 * POST /auth/logout
 * Invalidates the refresh token and clears the httpOnly cookie.
 */
export const logoutApi = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/auth/logout");
  return response.data;
};

/**
 * GET /auth/me
 * Retrieves the current user's profile using the access token.
 */
export const getMeApi = async (): Promise<MeResponse> => {
  const response = await api.get<MeResponse>("/auth/me");
  return response.data;
};

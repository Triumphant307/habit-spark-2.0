import { appStore } from "./app";
import { setAccessToken } from "@/services/api";
import { loginApi, signupApi, logoutApi, getMeApi, refreshApi } from "@/services/authApi";
import type { AuthUser, ApiErrorResponse } from "@/core/types/auth";
import { AxiosError } from "axios";
import logger from "@/utils/logger";

/**
 * Extracts a user-friendly error message from an API error.
 * Falls back to a generic message if the error shape is unexpected.
 */
const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiErrorResponse;
    return data.message || "An unexpected error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

// ---------------------------------------------------------------------------
// Auth Store Actions
// ---------------------------------------------------------------------------

/**
 * Authenticates a user with email and password.
 * On success, stores the access token in memory and updates the reactive store.
 *
 * @throws Error with the backend's error message on failure
 */
export const loginAction = async (data: { email: string; password: string }): Promise<AuthUser> => {
  try {
    const response = await loginApi(data);
    setAccessToken(response.token);

    appStore.auth.user = response.user;
    appStore.auth.isAuthenticated = true;
    appStore.auth.isLoading = false;

    logger.info("User logged in", { userId: response.user.id });
    return response.user;
  } catch (error) {
    appStore.auth.isLoading = false;
    const message = extractErrorMessage(error);
    logger.error("Login failed", { error: message });
    throw new Error(message);
  }
};

/**
 * Registers a new user.
 * Maps the frontend's "fullName" field to the backend's "nickname" field.
 *
 * @throws Error with the backend's error message on failure
 */
export const signupAction = async (data: {
  fullName: string;
  email: string;
  password: string;
}): Promise<AuthUser> => {
  try {
    const response = await signupApi({
      email: data.email,
      password: data.password,
      nickname: data.fullName, // Map fullName → nickname for the backend
    });

    setAccessToken(response.token);

    appStore.auth.user = response.user;
    appStore.auth.isAuthenticated = true;
    appStore.auth.isLoading = false;

    logger.info("User signed up", { userId: response.user.id });
    return response.user;
  } catch (error) {
    appStore.auth.isLoading = false;
    const message = extractErrorMessage(error);
    logger.error("Signup failed", { error: message });
    throw new Error(message);
  }
};

/**
 * Logs the user out.
 * Clears the access token, resets auth state, and the backend clears the refresh cookie.
 */
export const logoutAction = async (): Promise<void> => {
  try {
    await logoutApi();
  } catch (error) {
    // Log but don't throw — we still want to clear local state even if the API call fails
    logger.error("Logout API call failed", { error: extractErrorMessage(error) });
  } finally {
    setAccessToken(null);
    appStore.auth.user = null;
    appStore.auth.isAuthenticated = false;
    appStore.auth.isLoading = false;
  }
};

/**
 * Verifies the current session on app load.
 *
 * Flow:
 * 1. Attempt to refresh the access token using the httpOnly refresh cookie
 * 2. If refresh succeeds, fetch the user profile with the new token
 * 3. If either step fails, the user is not authenticated
 *
 * This runs once on app initialization (via AuthGuard).
 */
export const checkAuthAction = async (): Promise<void> => {
  try {
    // Step 1: Get a fresh access token via the refresh cookie
    const refreshResponse = await refreshApi();
    setAccessToken(refreshResponse.token);

    // Step 2: Fetch user profile with the new access token
    const meResponse = await getMeApi();

    appStore.auth.user = meResponse.user;
    appStore.auth.isAuthenticated = true;
  } catch {
    // No valid session — this is expected for unauthenticated users
    setAccessToken(null);
    appStore.auth.user = null;
    appStore.auth.isAuthenticated = false;
  } finally {
    appStore.auth.isLoading = false;
  }
};

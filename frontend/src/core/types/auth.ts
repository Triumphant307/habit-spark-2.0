/**
 * Authentication type definitions.
 * Mirrors the backend's Prisma User model (excluding sensitive fields like passwordHash).
 */

/**
 * Represents user preferences synced from the backend.
 */
export interface AuthUserPreferences {
  id: string;
  theme?: string | null;
  sidebarCollapsed?: boolean | null;
  onboardingGoal?: string | null;
  onboardingCommitment?: string | null;
}

/**
 * Represents the authenticated user profile returned by the backend.
 * Excludes sensitive fields (passwordHash, refreshTokens).
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  googleId?: string | null;
  preferences: AuthUserPreferences | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Application-level auth state stored in the reactor.
 */
export interface AuthState {
  /** The currently authenticated user, or null if not logged in */
  user: AuthUser | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether the initial auth check is still in progress */
  isLoading: boolean;
}

/**
 * Matches the error response shape from the backend's errorMiddleware.
 * Used for typed error handling in API calls.
 */
export interface ApiErrorResponse {
  status: "fail" | "error";
  statusCode: number;
  message: string;
  stack?: string;
}

/**
 * Successful auth response shape (login/signup).
 */
export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string; // Access token
}

/**
 * Token refresh response shape.
 */
export interface RefreshResponse {
  token: string;
}

/**
 * /auth/me response shape.
 */
export interface MeResponse {
  user: AuthUser;
}

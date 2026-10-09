import api from "./api";
import type { Tip } from "@/core/types/app";

export interface FetchSuggestionsParams {
  page?: number;
  limit?: number;
  category?: string;
  q?: string;
}

export interface FetchSuggestionsResponse {
  tips: Tip[];
  total: number;
  hasMore: boolean;
}

/**
 * Fetches a paginated, filtered, and searched list of suggestions.
 */
export const fetchSuggestionsApi = async (params: FetchSuggestionsParams): Promise<FetchSuggestionsResponse> => {
  // Filter out undefined/empty params so we don't send "category=" or "q="
  const filteredParams: Record<string, string | number> = {};
  if (params.page !== undefined) filteredParams.page = params.page;
  if (params.limit !== undefined) filteredParams.limit = params.limit;
  if (params.category && params.category !== "All" && params.category !== "Favorites") {
    filteredParams.category = params.category;
  }
  if (params.q) filteredParams.q = params.q;

  const response = await api.get<{
    suggestions?: Tip[];
    tips?: Tip[];
    total?: number;
    hasMore?: boolean;
    data?: Tip[];
    meta?: { total: number; page: number; totalPages: number };
  }>("/suggestions", {
    params: filteredParams,
  });

  // Handle potential backend structure variations
  return {
    tips: response.data.data || response.data.suggestions || response.data.tips || [],
    total: response.data.meta?.total || response.data.total || 0,
    hasMore: response.data.meta
      ? response.data.meta.page < response.data.meta.totalPages
      : (response.data.hasMore ?? false),
  };
};

/**
 * Toggles the favorite status of a tip.
 */
export const toggleFavoriteApi = async (tipId: string, isFavorite: boolean): Promise<void> => {
  await api.post("/suggestions/fav", { tipId, isFavorite });
};

/**
 * Fetches the available categories for suggestions.
 */
export const fetchSuggestionCategoriesApi = async (): Promise<string[]> => {
  const response = await api.get<string[]>("/suggestions/categories");
  // Ensure "All" and "Favorites" are always available on the frontend
  return response.data;
};

import { appStore } from "./app";
import {
  fetchSuggestionsApi,
  toggleFavoriteApi,
  fetchSuggestionCategoriesApi,
  FetchSuggestionsParams,
} from "@/services/suggestionApi";
import logger from "@/utils/logger";
import toast from "@/utils/toast";
import type { Tip } from "@/core/types/app";

/**
 * Fetches suggestions and updates the store.
 * @param resetCache If true, replaces the current tips array and resets page to 1.
 * @param params Filters and pagination params
 */
export const fetchSuggestionsAction = async (resetCache = true, params: FetchSuggestionsParams = {}) => {
  try {
    appStore.suggestions.isLoading = true;

    if (resetCache) {
      appStore.suggestions.currentPage = 1;
      params.page = 1;
    } else {
      params.page = appStore.suggestions.currentPage + 1;
    }

    const { tips, hasMore } = await fetchSuggestionsApi(params);

    if (resetCache) {
      appStore.suggestions.tips = tips;
    } else {
      appStore.suggestions.tips.push(...tips);
    }

    appStore.suggestions.currentPage = params.page;
    appStore.suggestions.hasMore = hasMore;
  } catch (error) {
    logger.error("Failed to fetch suggestions", { error });
    toast.error("Failed to load suggestions.");
  } finally {
    appStore.suggestions.isLoading = false;
  }
};

/**
 * Optimistically toggles a tip in favorites.
 */
export const toggleFavoriteAction = async (tip: Tip) => {
  const isCurrentlyFavorite = appStore.suggestions.favorites.some((fav) => fav.id === tip.id);
  const originalFavorites = [...appStore.suggestions.favorites];

  // Optimistic UI update
  if (isCurrentlyFavorite) {
    appStore.suggestions.favorites = appStore.suggestions.favorites.filter((fav) => fav.id !== tip.id);

    // Also remove from tips array if we are currently viewing the Favorites filter
    if (appStore.suggestions.filter === "Favorites") {
      appStore.suggestions.tips = appStore.suggestions.tips.filter((t) => t.id !== tip.id);
    }
  } else {
    appStore.suggestions.favorites.push(tip);

    // Also add to tips array if we are currently viewing the Favorites filter
    if (appStore.suggestions.filter === "Favorites") {
      appStore.suggestions.tips.push(tip);
    }
  }

  // Fire and forget backend call
  toggleFavoriteApi(String(tip.id), !isCurrentlyFavorite).catch((error) => {
    logger.error("Failed to toggle favorite", { error });
    toast.error("Failed to save favorite.");

    // Rollback
    appStore.suggestions.favorites = originalFavorites;
    if (appStore.suggestions.filter === "Favorites") {
      appStore.suggestions.tips = originalFavorites;
    }
  });
};

/**
 * Fetches categories.
 */
export const fetchCategoriesAction = async () => {
  try {
    const categories = await fetchSuggestionCategoriesApi();
    if (categories && categories.length > 0) {
      appStore.suggestions.categories = categories;
    }
  } catch (error) {
    logger.error("Failed to fetch suggestion categories", { error });
  }
};

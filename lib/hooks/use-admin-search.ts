import { useCallback, useEffect, useRef, useState } from "react";
import { getToken } from "@/lib/auth";

type SearchApiResponse<T> = {
  data?: { results: T[] };
  error?: string;
};

type UseAdminSearchConfig<T> = {
  searchApi: (token: string, query: string) => Promise<SearchApiResponse<T>>;
  filterCached?: (items: T[], query: string, limit: number) => T[];
  debounceMs?: number;
  suggestionLimit?: number;
};

export function useAdminSearch<T>({
  searchApi,
  filterCached,
  debounceMs = 300,
  suggestionLimit = 8,
}: UseAdminSearchConfig<T>) {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTick, setSearchTick] = useState(0);
  const [searchSuggestions, setSearchSuggestions] = useState<T[]>([]);
  const searchCacheRef = useRef<{ query: string; results: T[] } | null>(null);

  useEffect(() => {
    const query = searchInput.trim();
    if (!query) {
      queueMicrotask(() => setSearchSuggestions([]));
      return;
    }

    if (searchCacheRef.current) {
      const cached = searchCacheRef.current;
      if (cached.query === query) {
        setSearchSuggestions(cached.results.slice(0, suggestionLimit));
      } else if (filterCached) {
        const filtered = filterCached(cached.results, query, suggestionLimit);
        if (filtered.length > 0) {
          setSearchSuggestions(filtered);
        }
      }
    }

    const timer = setTimeout(() => {
      const token = getToken();
      if (!token) {
        setSearchSuggestions([]);
        return;
      }

      void searchApi(token, query).then((response) => {
        if (response.data) {
          setSearchSuggestions(response.data.results.slice(0, suggestionLimit));
          return;
        }
        setSearchSuggestions([]);
      });
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchInput, searchApi, filterCached, debounceMs, suggestionLimit]);

  const bumpSearch = useCallback(() => {
    setSearchTick((tick) => tick + 1);
  }, []);

  const applySearchFromQuery = useCallback(
    (query: string, resetPage?: () => void) => {
      searchCacheRef.current = null;
      setSearchInput(query);
      setSearchQuery(query.trim());
      resetPage?.();
      bumpSearch();
    },
    [bumpSearch]
  );

  const clearSearch = useCallback(
    (resetPage?: () => void) => {
      searchCacheRef.current = null;
      setSearchInput("");
      setSearchQuery("");
      setSearchSuggestions([]);
      resetPage?.();
      bumpSearch();
    },
    [bumpSearch]
  );

  const invalidateSearchCache = useCallback(() => {
    searchCacheRef.current = null;
  }, []);

  return {
    searchInput,
    setSearchInput,
    searchQuery,
    searchTick,
    searchSuggestions,
    searchCacheRef,
    applySearchFromQuery,
    clearSearch,
    bumpSearch,
    invalidateSearchCache,
  };
}

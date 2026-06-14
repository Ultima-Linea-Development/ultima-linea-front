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

function areSameSuggestionSlice<T>(left: T[], right: T[]): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

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
  const searchApiRef = useRef(searchApi);
  const filterCachedRef = useRef(filterCached);

  searchApiRef.current = searchApi;
  filterCachedRef.current = filterCached;

  const setSuggestionsIfChanged = useCallback((next: T[]) => {
    setSearchSuggestions((prev) => (areSameSuggestionSlice(prev, next) ? prev : next));
  }, []);

  useEffect(() => {
    const query = searchInput.trim();
    if (!query) {
      setSuggestionsIfChanged([]);
      return;
    }

    if (searchCacheRef.current) {
      const cached = searchCacheRef.current;
      if (cached.query === query) {
        setSuggestionsIfChanged(cached.results.slice(0, suggestionLimit));
      } else if (filterCachedRef.current) {
        const filtered = filterCachedRef.current(cached.results, query, suggestionLimit);
        if (filtered.length > 0) {
          setSuggestionsIfChanged(filtered);
        }
      }
    }

    const timer = setTimeout(() => {
      const token = getToken();
      if (!token) {
        setSuggestionsIfChanged([]);
        return;
      }

      void searchApiRef.current(token, query).then((response) => {
        if (response.data) {
          setSuggestionsIfChanged(response.data.results.slice(0, suggestionLimit));
          return;
        }
        setSuggestionsIfChanged([]);
      });
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchInput, debounceMs, suggestionLimit, setSuggestionsIfChanged]);

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

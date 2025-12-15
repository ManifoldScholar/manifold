import { useSearchParams } from "react-router";
import { useCallback, useMemo } from "react";

/**
 * Hook for managing list filters via URL search params.
 * Combines filter state reading and updating in one hook.
 *
 * @param {Object} options
 * @param {Object} options.defaultFilters - Default filter values
 * @param {string[]} options.paginationKeys - Keys to exclude from filters
 * @returns {{ filters: Object, setFilters: Function, searchParams: URLSearchParams }}
 */
export default function useListSearchParams(options = {}) {
  const { defaultFilters = {}, paginationKeys = ["page", "perPage"] } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const result = { ...defaultFilters };
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (!paginationKeys.includes(key)) {
        result[key] = value;
      }
    });
    return result;
  }, [searchParams, defaultFilters, paginationKeys]);

  const setFilters = useCallback(
    newFilters => {
      setSearchParams(prev => {
        // First, remove all non-pagination params
        const keysToDelete = [];
        prev.forEach((_, key) => {
          if (!paginationKeys.includes(key)) {
            keysToDelete.push(key);
          }
        });
        keysToDelete.forEach(key => prev.delete(key));

        // Reset page to 1
        prev.set("page", "1");

        // Then set the new filter values
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value != null && value !== "") {
            prev.set(key, String(value));
          }
        });

        return prev;
      });
    },
    [setSearchParams, paginationKeys]
  );

  return { filters, setFilters, searchParams };
}

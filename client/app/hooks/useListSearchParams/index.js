import { useSearchParams } from "react-router";
import { useCallback, useMemo } from "react";

/**
 * Hook for managing list filters via URL search params.
 * Combines filter state reading and updating in one hook.
 *
 * @param {Object} options
 * @param {Object} options.defaultFilters - Default filter values
 * @param {string[]} options.paginationKeys - Keys to exclude from filters
 * @param {string[]} options.arrayKeys - Keys that should always be treated as arrays (e.g., ["formats"])
 * @returns {{ filters: Object, setFilters: Function, searchParams: URLSearchParams }}
 */
export default function useListSearchParams(options = {}) {
  const {
    defaultFilters = {},
    paginationKeys = ["page", "perPage"],
    arrayKeys = []
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const result = { ...defaultFilters };

    // Get all unique keys from search params
    const paramKeys = new Set();
    searchParams.forEach((_, key) => {
      if (!paginationKeys.includes(key)) {
        paramKeys.add(key);
      }
    });

    // Process each key
    paramKeys.forEach(key => {
      const allValues = searchParams.getAll(key);

      // If key is in arrayKeys or has multiple values, treat as array
      if (arrayKeys.includes(key) || allValues.length > 1) {
        result[key] = allValues;
      } else if (allValues.length === 1) {
        result[key] = allValues[0];
      }
    });

    return result;
  }, [searchParams, defaultFilters, paginationKeys, arrayKeys]);

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
            // If value is an array, append each value
            if (Array.isArray(value)) {
              value.forEach(v => {
                if (v != null && v !== "") {
                  prev.append(key, String(v));
                }
              });
            } else {
              prev.set(key, String(value));
            }
          }
        });

        return prev;
      });
    },
    [setSearchParams, paginationKeys]
  );

  return { filters, setFilters, searchParams };
}

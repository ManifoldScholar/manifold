/**
 * Parse URL search params into filters and pagination for list routes.
 *
 * @param {URL} url - Request URL
 * @param {Object} options
 * @param {Object} options.defaultFilters - Default filter values (e.g., { standaloneModeEnforced: "false" })
 * @param {string[]} options.paginationKeys - Keys to treat as pagination (default: ["page", "perPage"])
 * @param {Object} options.defaultPagination - Default pagination values
 * @param {Object} options.additionalPagination - Additional nested pagination structures
 *   Format: { nestedKey: { numberKey: "urlParam", sizeKey: "urlParam", defaultNumber: 1, defaultSize: 4 } }
 * @param {string[]} options.arrayKeys - Keys that should always be treated as arrays (e.g., ["formats"])
 * @returns {{ filters: Object, pagination: Object }}
 */
export default function parseListParams(url, options = {}) {
  const {
    defaultFilters = {},
    paginationKeys = ["page", "perPage"],
    defaultPagination = { page: 1, perPage: 20 },
    additionalPagination = {},
    arrayKeys = []
  } = options;

  const page = parseInt(
    url.searchParams.get("page") || defaultPagination.page,
    10
  );
  const perPage = parseInt(
    url.searchParams.get("perPage") || defaultPagination.perPage,
    10
  );

  const filters = { ...defaultFilters };

  // Get all unique keys from search params
  const paramKeys = new Set();
  url.searchParams.forEach((_, key) => {
    if (!paginationKeys.includes(key)) {
      paramKeys.add(key);
    }
  });

  // Process each key
  paramKeys.forEach(key => {
    const allValues = url.searchParams.getAll(key);

    // If key is in arrayKeys or has multiple values, treat as array
    if (arrayKeys.includes(key) || allValues.length > 1) {
      filters[key] = allValues;
    } else if (allValues.length === 1) {
      filters[key] = allValues[0];
    }
  });

  const pagination = { number: page, size: perPage };

  // Add additional nested pagination structures
  Object.entries(additionalPagination).forEach(([nestedKey, config]) => {
    const { numberKey, sizeKey, defaultNumber = 1, defaultSize = 20 } = config;

    const number = parseInt(
      url.searchParams.get(numberKey) || defaultNumber,
      10
    );
    const size = parseInt(url.searchParams.get(sizeKey) || defaultSize, 10);

    pagination[nestedKey] = { number, size };
  });

  return {
    filters,
    pagination
  };
}

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
 * @returns {{ filters: Object, pagination: Object }}
 */
export default function parseListParams(url, options = {}) {
  const {
    defaultFilters = {},
    paginationKeys = ["page", "perPage"],
    defaultPagination = { page: 1, perPage: 20 },
    additionalPagination = {}
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
  Array.from(url.searchParams.entries()).forEach(([key, value]) => {
    if (!paginationKeys.includes(key)) {
      filters[key] = value;
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

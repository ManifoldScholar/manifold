/* Matches Resource.in_default_order in the API: featured resources (sort_order = 1)
 * first, then newest to oldest. Passed as the `order` filter so the sort select can
 * display the option that corresponds to the API's default ordering. */
export const RESOURCE_DEFAULT_ORDER = "sort_order ASC, created_at DESC";

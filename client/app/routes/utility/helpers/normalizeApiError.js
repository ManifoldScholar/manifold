/**
 * Normalizes API errors from ApiClient to a consistent format.
 * ApiClient rejects with { body: { errors: [...] } } for JSON:API format,
 * or { body: { exception, status, error } } for network errors/non-JSON responses.
 * Always returns an object with an errors array.
 *
 * @param {Error|Object|Response} error - The error from ApiClient or other sources
 * @returns {Object} Normalized error object with errors array
 */
export default function normalizeApiError(
  error,
  defaultMessage = "An error occurred"
) {
  // If it's a Response object, convert to error format
  if (error instanceof Response) {
    return {
      errors: [
        {
          detail: error.statusText || defaultMessage,
          status: error.status,
          source: { pointer: "/data" }
        }
      ]
    };
  }

  // If it has body.errors (JSON:API format), return those
  if (error?.body?.errors) {
    return { errors: error.body.errors };
  }

  // Fallback: handle legacy format (network errors, non-JSON responses) or unexpected errors
  return {
    errors: [
      {
        detail:
          error?.body?.exception ||
          error?.body?.error ||
          error?.message ||
          "An unexpected error occurred",
        status: error?.body?.status,
        source: { pointer: "/data" }
      }
    ]
  };
}

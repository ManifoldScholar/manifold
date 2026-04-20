/**
 * Handles errors in route actions. Returns standardized error response
 * or re-throws redirects.
 *
 * @param {Error|Object|Response} error - The error to handle
 * @param {string} [fallbackMessage] - Used when the error carries no detail of its own
 * @returns {Object} Object with errors array, or throws Response for redirects
 */
export default function handleActionError(
  error,
  fallbackMessage = "An unexpected error occurred"
) {
  // Re-throw redirects (3xx) - these need to trigger navigation
  if (error instanceof Response && error.status >= 300 && error.status < 400) {
    throw error;
  }

  // ApiClient rejects with { body: { errors: [...] } } for JSON:API errors
  if (error?.body?.errors) {
    return { errors: error.body.errors };
  }

  // Network errors, non-JSON responses
  return {
    errors: [
      {
        detail:
          error?.body?.exception ||
          error?.body?.error ||
          error?.message ||
          fallbackMessage,
        status: error?.body?.status
      }
    ]
  };
}

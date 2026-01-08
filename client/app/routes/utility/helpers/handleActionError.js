import normalizeApiError from "./normalizeApiError";

/**
 * Handles errors in route actions. Returns standardized error response
 * or re-throws redirects.
 *
 * @param {Error|Object|Response} error - The error to handle
 * @param {string} defaultMessage - Default error message if error can't be normalized
 * @returns {Object} Object with errors array, or throws Response for redirects
 */
export default function handleActionError(
  error,
  defaultMessage = "An error occurred"
) {
  // Re-throw redirects (3xx) - these need to trigger navigation
  if (error instanceof Response && error.status >= 300 && error.status < 400) {
    throw error;
  }

  // normalizeApiError always returns an object with errors array
  return normalizeApiError(error, defaultMessage);
}

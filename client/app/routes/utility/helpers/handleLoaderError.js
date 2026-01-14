import { data } from "react-router";

/**
 * Handles errors in route loaders with configurable behavior.
 *
 * @param {Error|Object|Response} error - The error to handle
 * @param {Object} options - Configuration options
 * @param {number} options.notFoundStatus - HTTP status code for not found errors (default: 404)
 * @param {boolean} options.preserveRedirects - Whether to preserve redirect Responses (default: true)
 * @param {boolean} options.preserveResponses - Whether to preserve all Response objects (default: true)
 * @throws {Response} Always throws a Response object
 */
export default function handleLoaderError(error, options = {}) {
  const {
    notFoundStatus = 404,
    preserveRedirects = true,
    preserveResponses = true
  } = options;

  // Preserve redirects and other Response objects
  if (error instanceof Response) {
    if (preserveRedirects && error.status >= 300 && error.status < 400) {
      throw error;
    }
    if (preserveResponses) {
      throw error;
    }
  }

  if (error.status) throw error;

  // Convert all non-Response errors to not found
  throw data(null, { status: notFoundStatus });
}

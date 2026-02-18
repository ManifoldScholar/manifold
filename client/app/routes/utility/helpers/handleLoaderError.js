import { data } from "react-router";

/**
 * Handles errors in route loaders with configurable behavior.
 *
 * @param {Error|Object|Response} error - The error to handle
 * @throws {Response} Always throws a Response object
 */
export default function handleLoaderError(error) {
  if (error.status) throw error;

  // Convert all non-Response errors to not found
  throw data(null, { status: 404 });
}

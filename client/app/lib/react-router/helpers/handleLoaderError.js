import { data } from "react-router";

/**
 * Handles errors in route loaders by throwing to the nearest boundary.
 *
 * Preserves status when the error already carries one (API failures come
 * through with `error.status`; some rejections carry it as `error.body.status`).
 * Non-Response errors (loader-body bugs, null derefs, bad args, malformed URLs,
 * etc.) default to 500 rather than masquerading as 404.
 *
 * @param {Error|Object|Response} error - The error to handle
 * @throws {Response} Always throws a Response object
 */
export default function handleLoaderError(error) {
  if (error?.status) throw error;
  if (error?.body?.status) {
    throw data(error.body, { status: error.body.status });
  }

  // eslint-disable-next-line no-console
  console.error("[handleLoaderError] non-Response error:", error);
  throw data(
    { message: error?.message ?? "Unexpected loader error" },
    { status: 500 }
  );
}

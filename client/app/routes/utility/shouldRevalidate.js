/**
 * Shared shouldRevalidate function for route loaders.
 *
 * Prevents refetching data on every navigation while still allowing:
 * - Explicit revalidate() calls (login/logout)
 * - Form submissions
 *
 * Use by exporting from route modules:
 *   export { shouldRevalidate } from "helpers/router/shouldRevalidate";
 */
export const shouldRevalidate = ({
  currentUrl,
  nextUrl,
  formAction,
  defaultShouldRevalidate
}) => {
  // Always revalidate on form submission
  if (formAction) {
    return defaultShouldRevalidate;
  }

  // Revalidate if staying on same URL (explicit revalidate() call)
  if (currentUrl.pathname === nextUrl.pathname) {
    return defaultShouldRevalidate;
  }

  // For navigations to different pages, use cached data
  return false;
};

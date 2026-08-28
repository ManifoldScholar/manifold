import { queryApi } from "api";
import handleLoaderError from "lib/react-router/helpers/handleLoaderError";
import { data, redirect } from "react-router";
import requireLogin from "./requireLogin";

export const PROJECT_AUTHORIZATION_ERROR_PARAM = "projectAuthorizationError";

/**
 * When a project's child entity (text, resource, collection) is restricted but the
 * project itself is readable, the API responds 401/403 with the project in
 * `errors[0]`. Return the user to the project detail page (with a flag that
 * triggers a notification) instead of rendering a fatal error. No-op when
 * already on the project detail page.
 */
function maybeRedirectToProject(error, url) {
  if (error?.status !== 401 && error?.status !== 403) return;
  const slug =
    error.body?.errors?.[0]?.project?.slug ?? error.body?.project?.slug;
  if (!slug) return;

  const target = `/projects/${slug}`;
  const pathname = url?.pathname ?? "";
  if (pathname === target || pathname === `${target}/`) return;

  throw redirect(`${target}?${PROJECT_AUTHORIZATION_ERROR_PARAM}=true`);
}

export default async function EntityLoader({ context, fetchFn, url }) {
  try {
    const entity = await queryApi(fetchFn(), context);

    if (!entity?.data) {
      throw data("No entity data returned from api", { status: 404 });
    }

    return entity.data;
  } catch (error) {
    if (error.status === 401) requireLogin(url, context);
    maybeRedirectToProject(error, url);
    handleLoaderError(error);
  }
}

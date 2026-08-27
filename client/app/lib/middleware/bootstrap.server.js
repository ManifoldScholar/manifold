import { ApiClient, settingsAPI, meAPI, pagesAPI } from "api";
import { routerContext } from "contexts";

const CLEAR_TOKEN_STATUSES = [401, 419];

const getCookie = (request, name) => {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
};

const describeFailure = reason =>
  reason?.body?.errors?.[0]?.detail
    ? `${reason.status} ${reason.body.errors[0].detail}`
    : reason;

export const bootstrapMiddleware = async ({ request, context }, next) => {
  const authToken = getCookie(request, "authToken");
  const client = new ApiClient(authToken);

  const [
    settingsResult,
    userResult,
    collectionResult,
    pagesResult,
    readingGroupsResult
  ] = await Promise.allSettled([
    client.call(settingsAPI.show()),
    authToken ? client.call(meAPI.show()) : Promise.resolve(null),
    authToken ? client.call(meAPI.myCollection()) : Promise.resolve(null),
    client.call(pagesAPI.index()),
    authToken ? client.call(meAPI.readingGroups()) : Promise.resolve(null)
  ]);

  let settings = null;
  let auth = null;
  let pages = [];
  let clearAuthToken = false;

  if (settingsResult.status === "fulfilled") {
    settings = settingsResult.value?.data;
  } else {
    console.error(
      "[Middleware] Failed to load settings:",
      describeFailure(settingsResult.reason)
    );
  }

  if (userResult.status === "fulfilled" && userResult.value) {
    const user = userResult.value?.data;

    if (
      collectionResult.status === "fulfilled" &&
      collectionResult.value?.data
    ) {
      if (!user.relationships) {
        user.relationships = {};
      }
      user.relationships.collection = collectionResult.value.data;
    }

    const readingGroups =
      readingGroupsResult.status === "fulfilled" &&
      readingGroupsResult.value?.data
        ? readingGroupsResult.value.data
        : [];

    auth = {
      user,
      authToken,
      readingGroups
    };
  } else if (authToken && userResult.status === "rejected") {
    clearAuthToken = CLEAR_TOKEN_STATUSES.includes(userResult.reason?.status);

    if (clearAuthToken) {
      console.warn(
        `[Middleware] Rejected authToken (${userResult.reason.status}); clearing the cookie.`
      );
    } else {
      console.error(
        "[Middleware] Failed to authenticate:",
        describeFailure(userResult.reason)
      );
    }
  }

  if (pagesResult.status === "fulfilled" && pagesResult.value) {
    pages = pagesResult.value?.data ?? [];
  } else if (pagesResult.status === "rejected") {
    console.error(
      "[Middleware] Failed to load pages:",
      describeFailure(pagesResult.reason)
    );
  }

  context.set(routerContext, { settings, auth, pages });

  const response = await next();

  if (clearAuthToken && response?.headers) {
    response.headers.append(
      "Set-Cookie",
      "authToken=; Path=/; Max-Age=0; SameSite=Lax"
    );
  }

  return response;
};

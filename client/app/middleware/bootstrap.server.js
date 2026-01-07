import { ApiClient, settingsAPI, meAPI, pagesAPI } from "api";
import { routerContext } from "../contexts";

const getCookie = (request, name) => {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
};

export const bootstrapMiddleware = async ({ request, context }, next) => {
  const authToken = getCookie(request, "authToken");
  const client = new ApiClient(authToken);

  const [
    settingsResult,
    userResult,
    collectionResult,
    pagesResult
  ] = await Promise.allSettled([
    client.call(settingsAPI.show()),
    authToken ? client.call(meAPI.show()) : Promise.resolve(null),
    authToken ? client.call(meAPI.myCollection()) : Promise.resolve(null),
    client.call(pagesAPI.index())
  ]);

  let settings = null;
  let auth = null;
  let pages = [];

  if (settingsResult.status === "fulfilled") {
    settings = settingsResult.value?.data;
  } else {
    console.error(
      "[Middleware] Failed to load settings:",
      settingsResult.reason
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

    auth = {
      user,
      authToken
    };
  } else if (authToken && userResult.status === "rejected") {
    console.error("[Middleware] Failed to authenticate:", userResult.reason);
  }

  if (pagesResult.status === "fulfilled" && pagesResult.value) {
    pages = pagesResult.value?.data ?? [];
  } else if (pagesResult.status === "rejected") {
    console.error("[Middleware] Failed to load pages:", pagesResult.reason);
  }

  context.set(routerContext, { settings, auth, pages });

  return next();
};

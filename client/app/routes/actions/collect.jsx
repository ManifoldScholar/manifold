import { collectingAPI } from "api";
import { routerContext } from "app/contexts";
import { queryApi } from "api";
import handleActionError from "lib/react-router/helpers/handleActionError";
import unauthorizedError from "lib/react-router/helpers/unauthorizedError";

export async function action({ request, context }) {
  const { auth } = context.get(routerContext) ?? {};
  if (!auth?.authToken) return unauthorizedError();

  const data = await request.json();
  const { intent, collectables, collection } = data;

  if (!intent || !collectables || !collection) {
    return {
      errors: [{ detail: "Missing required fields" }]
    };
  }

  try {
    let result;

    if (intent === "collect") {
      result = await queryApi(
        collectingAPI.collect(collectables, collection),
        context
      );
    } else if (intent === "remove") {
      result = await queryApi(
        collectingAPI.remove(collectables, collection),
        context
      );
    } else {
      return { errors: [{ detail: "Invalid intent" }] };
    }

    if (result?.errors) return { errors: result.errors };
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

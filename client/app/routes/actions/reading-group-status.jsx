import { routerContext } from "app/contexts";
import { queryApi } from "api";
import handleActionError from "lib/react-router/helpers/handleActionError";
import unauthorizedError from "lib/react-router/helpers/unauthorizedError";

export async function action({ request, context }) {
  const { auth } = context.get(routerContext) ?? {};
  if (!auth?.authToken) return unauthorizedError();

  const data = await request.json();
  const { intent, endpoint } = data;

  if (!endpoint?.startsWith("/api/v1/")) {
    return { errors: [{ detail: "Invalid endpoint" }] };
  }

  try {
    let result;

    if (intent === "archive" || intent === "activate") {
      result = await queryApi(
        { endpoint, method: "POST", options: {} },
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

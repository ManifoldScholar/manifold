import { routerContext } from "app/contexts";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";

export async function action({ request, context }) {
  const { auth } = context.get(routerContext) ?? {};
  if (!auth?.authToken) {
    return { errors: [{ detail: "Unauthorized" }] };
  }

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

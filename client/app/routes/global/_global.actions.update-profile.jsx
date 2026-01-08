import { meAPI } from "api";
import { routerContext } from "app/contexts";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";

export async function action({ request, context }) {
  const { auth } = context.get(routerContext) ?? {};
  if (!auth?.authToken) {
    return {
      errors: [
        {
          detail: "Authentication required",
          source: { pointer: "/data" }
        }
      ]
    };
  }

  const data = await request.json();

  try {
    const result = await queryApi(meAPI.update(data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    return { success: true };
  } catch (error) {
    return handleActionError(error, "Failed to update profile");
  }
}

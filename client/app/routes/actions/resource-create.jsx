import { resourcesAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import { routerContext } from "app/contexts";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import unauthorizedError from "app/routes/utility/helpers/unauthorizedError";

export async function action({ request, context }) {
  const { auth } = context.get(routerContext) ?? {};
  if (!auth?.authToken) return unauthorizedError();

  const data = await request.json();
  const { projectId, resource } = data;

  try {
    const result = await queryApi(
      resourcesAPI.create(projectId, resource),
      context
    );
    if (result?.errors) return { errors: result.errors };
    return { resource: result.data };
  } catch (error) {
    return handleActionError(error);
  }
}

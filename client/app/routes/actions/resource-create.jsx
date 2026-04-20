import { resourcesAPI } from "api";
import { routerContext } from "app/contexts";
import { queryApi } from "api";
import handleActionError from "lib/react-router/helpers/handleActionError";
import unauthorizedError from "lib/react-router/helpers/unauthorizedError";

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

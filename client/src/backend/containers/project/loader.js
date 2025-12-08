import dataLoader from "helpers/router/loaders/dataLoader";
import authorizeLoader from "helpers/router/loaders/authorizeLoader";
import { projectsAPI } from "api";
import { getStore } from "store/storeInstance";
import { select } from "utils/entityUtils";

export default async function loader({ params, request, context }) {
  const { id } = params;
  const store = context?.store || getStore();

  const { requestKey } = await dataLoader({
    request: [projectsAPI.show, id],
    context
  });

  const state = store.getState();
  const project = select(requestKey, state.entityStore);

  if (!project) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found"
    });
  }

  const url = new URL(request.url);

  await authorizeLoader({
    context,
    ability: ["update", "manageResources"],
    entity: project,
    failureRedirect: true,
    failureMessage: "projects.unauthorized_edit",
    currentPath: url.pathname
  });

  return { requestKey };
}

import { redirect } from "react-router";
import dataLoader from "helpers/router/loaders/dataLoader";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";

export default async function loader({ params, context }) {
  const { id } = params;

  if (id === "all") {
    throw redirect(lh.link("frontendProjectsAll"));
  }

  await dataLoader({
    request: [projectsAPI.show, id],
    context
  });

  return { projectId: id };
}

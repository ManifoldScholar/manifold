import { redirect } from "react-router";
import { Outlet } from "react-router";
import { projectsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";

export const loader = async ({ params, context }) => {
  if (params.id === "all") {
    throw redirect("/projects");
  }

  const fetchFn = () => projectsAPI.show(params.id);
  return loadEntity({ context, fetchFn });
};

export default function ProjectWrapperRoute({ loaderData: project }) {
  return <Outlet context={project} />;
}

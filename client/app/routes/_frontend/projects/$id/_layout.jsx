import { redirect } from "react-router";
import { Outlet } from "react-router";
import { projectsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import ProjectAuthorizationErrorNotice from "components/frontend/project/AuthorizationErrorNotice";

export const loader = async ({ params, context, url }) => {
  if (params.id === "all") {
    throw redirect("/projects");
  }

  const fetchFn = () => projectsAPI.show(params.id);
  return loadEntity({ context, fetchFn, url });
};

export default function ProjectWrapperRoute({ loaderData: project }) {
  return (
    <>
      <ProjectAuthorizationErrorNotice />
      <Outlet context={project} />
    </>
  );
}

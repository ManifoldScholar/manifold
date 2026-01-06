import { redirect } from "react-router";
import { Outlet } from "react-router";
import { projectsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import EventTracker, { EVENTS } from "global/components/EventTracker";

export const loader = async ({ params, context }) => {
  if (params.id === "all") {
    throw redirect("/projects");
  }

  const fetchFn = () => projectsAPI.show(params.id);
  return loadEntity({ context, fetchFn });
};

export default function ProjectWrapperRoute({ loaderData: project }) {
  return (
    <>
      <EventTracker event={EVENTS.VIEW_RESOURCE} resource={project} />
      <Outlet context={project} />
    </>
  );
}

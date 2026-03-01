import { Outlet, useOutletContext } from "react-router";
import { resourceCollectionsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import checkLibraryMode from "app/routes/utility/loaders/checkLibraryMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";

export const loader = async ({ params, request, context }) => {
  checkLibraryMode({ request, context });

  const fetchFn = () =>
    resourceCollectionsAPI.show(params.resourceCollectionId);
  return loadEntity({ context, fetchFn });
};

export default function ResourceCollectionLayoutRoute({
  loaderData: collection
}) {
  const project = useOutletContext();

  return (
    <>
      <EventTracker event={EVENTS.VIEW_RESOURCE} resource={collection} />
      <Outlet context={{ project, collection }} />
    </>
  );
}

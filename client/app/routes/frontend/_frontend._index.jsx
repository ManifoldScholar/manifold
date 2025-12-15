import {
  ApiClient,
  projectCollectionsAPI,
  journalsAPI,
  projectsAPI,
  featuresAPI
} from "api";
import { routerContext } from "app/contexts";
import checkLibraryMode from "app/routes/utility/checkLibraryMode";
import Content from "frontend/containers/Home/Content";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import HeadContent from "global/components/HeadContent";

const COLLECTION_FILTERS = {
  visibleOnHomepage: true,
  order: "position ASC"
};

const PROJECT_FILTERS = {
  standaloneModeEnforced: false,
  order: "sort_title, title"
};

const PROJECT_PAGINATION = { number: 1, size: 20 };

const JOURNAL_FILTERS = {
  showOnHomepage: true
};

const FEATURES_FILTERS = { home: true };

export const loader = async ({ request, context }) => {
  // Check library mode first (may redirect)
  checkLibraryMode({ request, context });

  // Get settings and auth from middleware context
  const { settings, auth } = context.get(routerContext) ?? {};

  const { hasVisibleHomeProjectCollections, hasVisibleProjects } =
    settings?.attributes?.calculated ?? {};
  const showProjects = !hasVisibleHomeProjectCollections;

  // Create authenticated API client with auto-denormalization
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  // Fetch all data in parallel
  const [
    journalsResult,
    featuresResult,
    projectsOrCollectionsResult
  ] = await Promise.allSettled([
    client.call(journalsAPI.index(JOURNAL_FILTERS)),
    client.call(featuresAPI.index(FEATURES_FILTERS)),
    client.call(
      showProjects
        ? projectsAPI.index(PROJECT_FILTERS, PROJECT_PAGINATION)
        : projectCollectionsAPI.index(COLLECTION_FILTERS)
    )
  ]);

  // Extract data from results (already denormalized by ApiClient)
  const journals =
    journalsResult.status === "fulfilled" ? journalsResult.value : [];
  const features =
    featuresResult.status === "fulfilled" ? featuresResult.value : [];
  const projectsOrCollections =
    projectsOrCollectionsResult.status === "fulfilled"
      ? projectsOrCollectionsResult.value
      : [];

  return {
    journals,
    features,
    projects: showProjects ? projectsOrCollections : null,
    collections: !showProjects ? projectsOrCollections : null,
    showProjects,
    hasVisibleProjects
  };
};

export default function HomePage() {
  return (
    <>
      <HeadContent />
      <EventTracker event={EVENTS.VIEW_LIBRARY} />
      <Content />
    </>
  );
}

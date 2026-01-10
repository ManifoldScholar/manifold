import {
  projectCollectionsAPI,
  journalsAPI,
  projectsAPI,
  featuresAPI
} from "api";
import { routerContext } from "app/contexts";
import checkLibraryMode from "app/routes/utility/loaders/checkLibraryMode";
import loadParallelLists from "app/routes/utility/loaders/loadParallelLists";
import Content from "frontend/components/home/Content";
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

export { shouldRevalidate } from "app/routes/utility/loaders/shouldRevalidate";

export const loader = async ({ request, context }) => {
  checkLibraryMode({ request, context });

  const { settings } = context.get(routerContext) ?? {};

  const { hasVisibleHomeProjectCollections, hasVisibleProjects } =
    settings?.attributes?.calculated ?? {};
  const showProjects = !hasVisibleHomeProjectCollections;

  const results = await loadParallelLists({
    context,
    fetchFns: {
      journals: () => journalsAPI.index(JOURNAL_FILTERS),
      features: () => featuresAPI.index(FEATURES_FILTERS),
      projectsOrCollections: () =>
        showProjects
          ? projectsAPI.index(PROJECT_FILTERS, PROJECT_PAGINATION)
          : projectCollectionsAPI.index(COLLECTION_FILTERS)
    }
  });

  return {
    journals: results.journals ?? [],
    features: results.features ?? [],
    projects: showProjects ? results.projectsOrCollections ?? null : null,
    collections: !showProjects ? results.projectsOrCollections ?? null : null,
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

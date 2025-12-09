import dataLoader from "helpers/router/loaders/dataLoader";
import checkLibraryMode from "helpers/router/loaders/checkLibraryMode";
import {
  projectCollectionsAPI,
  journalsAPI,
  projectsAPI,
  featuresAPI,
  requests
} from "api";
import { getStore } from "store/storeInstance";
import { select } from "utils/entityUtils";

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

export default async function loader({ request, context }) {
  // Check library mode first
  await checkLibraryMode({ request, context });

  const store = context?.store || getStore();
  const state = store.getState();

  // Get settings to determine what to fetch
  const settings = select(requests.settings, state.entityStore);
  const { hasVisibleHomeProjectCollections } =
    settings?.attributes?.calculated ?? {};
  const showProjects = !hasVisibleHomeProjectCollections;

  // Get authentication state
  const authentication = state.authentication;
  const isAuthenticated = authentication?.authenticated;

  // Fetch homepage content in parallel
  // Always fetch journals and features (they're always shown)
  // Conditionally fetch projects or collections based on settings
  const fetchPromises = [
    dataLoader({
      request: [journalsAPI.index, JOURNAL_FILTERS],
      context
    }),
    dataLoader({
      request: [featuresAPI.index, FEATURES_FILTERS],
      context
    })
  ];

  if (showProjects) {
    fetchPromises.push(
      dataLoader({
        request: [projectsAPI.index, PROJECT_FILTERS, PROJECT_PAGINATION],
        context
      })
    );
  } else if (isAuthenticated) {
    // Only fetch collections if authenticated (useFetch has this condition)
    fetchPromises.push(
      dataLoader({
        request: [projectCollectionsAPI.index, COLLECTION_FILTERS],
        context
      })
    );
  }

  const results = await Promise.all(fetchPromises);

  return {
    journalsRequestKey: results[0].requestKey,
    featuresRequestKey: results[1].requestKey,
    projectsRequestKey: showProjects ? results[2]?.requestKey : null,
    collectionsRequestKey:
      !showProjects && isAuthenticated ? results[2]?.requestKey : null
  };
}

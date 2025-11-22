import { useFetch, useAuthentication } from "hooks";
import {
  projectCollectionsAPI,
  journalsAPI,
  projectsAPI,
  featuresAPI
} from "api";

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

export default function useFetchHomepageContent(fetchProjects) {
  const authentication = useAuthentication();

  const { data: projectsData, loaded: projectsLoaded } = useFetch({
    request: [projectsAPI.index, PROJECT_FILTERS, PROJECT_PAGINATION],
    condition: fetchProjects
  });

  const { data: collectionsData, loaded: collectionsLoaded } = useFetch({
    request: [projectCollectionsAPI.index, COLLECTION_FILTERS],
    dependencies: [authentication.authenticated],
    condition: !fetchProjects
  });

  const { data: journalsData, loaded: journalsLoaded } = useFetch({
    request: [journalsAPI.index, JOURNAL_FILTERS],
    dependencies: [authentication.authenticated]
  });

  const { data: features, loaded: featuresLoaded } = useFetch({
    request: [featuresAPI.index, FEATURES_FILTERS],
    dependencies: [authentication.authenticated]
  });

  const loaded =
    journalsLoaded && featuresLoaded && fetchProjects
      ? projectsLoaded
      : collectionsLoaded;

  const projects = projectsData?.filter(p => !p?.attributes.markedForPurgeAt);
  const journals = journalsData?.map(j => ({
    ...j,
    relationships: {
      ...j.relationships,
      recentJournalIssues: j.relationships.recentJournalIssues.filter(
        i => !i?.attributes.projectMarkedForPurgeAt
      )
    }
  }));
  const collections = collectionsData?.map(c => ({
    ...c,
    relationships: {
      ...c.relationships,
      collectionProjects: c.relationships.collectionProjects.filter(
        p => !p?.attributes.markedForPurgeAt
      )
    }
  }));

  return { loaded, journals, projects, collections, features };
}

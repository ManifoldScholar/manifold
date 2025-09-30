import { useMemo } from "react";
import { useFetch, useAuthentication } from "hooks";
import {
  projectCollectionsAPI,
  journalsAPI,
  projectsAPI,
  featuresAPI
} from "api";

export default function useFetchHomepageContent(fetchProjects) {
  const authentication = useAuthentication();

  const collectionFilters = useMemo(
    () => ({
      visibleOnHomepage: true,
      order: "position ASC"
    }),
    []
  );

  const projectFilters = useMemo(
    () => ({
      standaloneModeEnforced: false,
      order: "sort_title, title"
    }),
    []
  );

  const projectPagination = useMemo(() => ({ number: 1, size: 20 }), []);

  const journalFilters = useMemo(
    () => ({
      showOnHomepage: true
    }),
    []
  );

  const featuresFilters = useMemo(() => ({ home: true }), []);

  const { data: projectsData, loaded: projectsLoaded } = useFetch({
    request: [projectsAPI.index, projectFilters, projectPagination],
    condition: fetchProjects
  });

  const { data: collectionsData, loaded: collectionsLoaded } = useFetch({
    request: [projectCollectionsAPI.index, collectionFilters],
    dependencies: [authentication.authenticated],
    condition: !fetchProjects
  });

  const { data: journalsData, loaded: journalsLoaded } = useFetch({
    request: [journalsAPI.index, journalFilters],
    dependencies: [authentication.authenticated]
  });

  const { data: features, loaded: featuresLoaded } = useFetch({
    request: [featuresAPI.index, featuresFilters],
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

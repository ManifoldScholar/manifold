import { useMemo } from "react";
import { useFetch } from "hooks";
import {
  projectCollectionsAPI,
  journalsAPI,
  projectsAPI,
  featuresAPI,
} from "api";

export default function useFetchHomepageContent(fetchProjects) {
  const collectionFilters = useMemo(
    () => ({
      visibleOnHomepage: true,
      order: "position ASC",
    }),
    [],
  );

  const projectFilters = useMemo(
    () => ({
      standaloneModeEnforced: false,
      order: "sort_title, title",
    }),
    [],
  );

  const projectPagination = useMemo(() => ({ number: 1, size: 20 }), []);

  const journalFilters = useMemo(
    () => ({
      showOnHomepage: true,
    }),
    [],
  );

  const featuresFilters = useMemo(() => ({ home: true }), []);

  const { data: projects, loaded: projectsLoaded } = useFetch({
    request: [projectsAPI.index, projectFilters, projectPagination],
    condition: fetchProjects,
  });

  const { data: collections, loaded: collectionsLoaded } = useFetch({
    request: [projectCollectionsAPI.index, collectionFilters],
    withAuthDependency: true,
    condition: !fetchProjects,
  });

  const { data: journals, loaded: journalsLoaded } = useFetch({
    request: [journalsAPI.index, journalFilters],
    withAuthDependency: true,
  });

  const { data: features, loaded: featuresLoaded } = useFetch({
    request: [featuresAPI.index, featuresFilters],
    withAuthDependency: true,
  });

  const loaded =
    journalsLoaded && featuresLoaded && fetchProjects
      ? projectsLoaded
      : collectionsLoaded;

  return { loaded, journals, projects, collections, features };
}

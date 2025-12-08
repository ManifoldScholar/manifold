import Feature from "./Feature";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import { useFromStore } from "hooks";
import { useLoaderData } from "react-router";
import EntityCollection from "frontend/components/entity/Collection";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import { requests } from "api";

export default function Content() {
  const loaderData = useLoaderData();
  const {
    journalsRequestKey,
    featuresRequestKey,
    projectsRequestKey,
    collectionsRequestKey
  } = loaderData || {};

  const settings = useFromStore({
    requestKey: requests.settings,
    action: "select"
  });

  const { hasVisibleHomeProjectCollections, hasVisibleProjects } =
    settings?.attributes?.calculated ?? {};
  const showProjects = !hasVisibleHomeProjectCollections;

  const projects = useFromStore({
    requestKey: projectsRequestKey,
    action: "select"
  });
  const collections = useFromStore({
    requestKey: collectionsRequestKey,
    action: "select"
  });
  const journals = useFromStore({
    requestKey: journalsRequestKey,
    action: "select"
  });
  const features = useFromStore({
    requestKey: featuresRequestKey,
    action: "select"
  });

  // Filter data (matching useFetchHomepageContent logic)
  const filteredProjects = projects?.filter(
    p => !p?.attributes.markedForPurgeAt
  );
  const filteredJournals = journals?.map(j => ({
    ...j,
    relationships: {
      ...j.relationships,
      recentJournalIssues: j.relationships.recentJournalIssues.filter(
        i => !i?.attributes.projectMarkedForPurgeAt
      )
    }
  }));
  const filteredCollections = collections?.map(c => ({
    ...c,
    relationships: {
      ...c.relationships,
      collectionProjects: c.relationships.collectionProjects.filter(
        p => !p?.attributes.markedForPurgeAt
      )
    }
  }));

  const loaded = !!(
    (showProjects ? filteredProjects : filteredCollections) &&
    filteredJournals &&
    features
  );

  if (!loaded) return null;

  if (
    !filteredProjects?.length &&
    !filteredCollections?.length &&
    !filteredJournals?.length
  )
    return <EntityCollectionPlaceholder.Projects />;

  const renderCollections = filteredCollections?.length
    ? filteredCollections.map((projectCollection, i) => (
        <EntityCollection.ProjectCollectionSummary
          key={projectCollection.id}
          projectCollection={projectCollection}
          limit={projectCollection.attributes.homepageCount}
          bgColor={i % 2 === 0 ? "neutral05" : "white"}
        />
      ))
    : null;

  const renderProjects = filteredProjects?.length ? (
    <EntityCollection.ProjectsSummary
      projects={filteredProjects}
      bgColor="neutral05"
    />
  ) : null;

  const count = showProjects ? 1 : filteredCollections?.length;

  return (
    <>
      <Feature features={features} />
      {showProjects ? renderProjects : renderCollections}
      {!!filteredJournals?.length &&
        filteredJournals.map((journal, i) => (
          <EntityCollection.JournalSummary
            key={journal.id}
            journal={journal}
            bgColor={(count + i) % 2 === 0 ? "neutral05" : "white"}
            limit={8}
          />
        ))}
      {hasVisibleProjects && <CollectionNavigation />}
    </>
  );
}

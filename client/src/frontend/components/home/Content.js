import Feature from "./Feature";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import { useLoaderData } from "react-router";
import EntityCollection from "frontend/components/entity/Collection";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";

export default function Content() {
  const {
    journals,
    features,
    projects,
    collections,
    showProjects,
    hasVisibleProjects
  } = useLoaderData() || {};

  // Filter data (matching useFetchHomepageContent logic)
  const filteredProjects = Array.isArray(projects)
    ? projects.filter(p => !p?.attributes?.markedForPurgeAt)
    : null;

  const filteredJournals = Array.isArray(journals)
    ? journals.map(j => ({
        ...j,
        relationships: {
          ...j.relationships,
          recentJournalIssues: Array.isArray(
            j.relationships?.recentJournalIssues
          )
            ? j.relationships.recentJournalIssues.filter(
                i => !i?.attributes?.projectMarkedForPurgeAt
              )
            : []
        }
      }))
    : null;

  const filteredCollections = Array.isArray(collections)
    ? collections.map(c => ({
        ...c,
        relationships: {
          ...c.relationships,
          collectionProjects: Array.isArray(c.relationships?.collectionProjects)
            ? c.relationships.collectionProjects.filter(
                p => !p?.attributes?.markedForPurgeAt
              )
            : []
        }
      }))
    : null;

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

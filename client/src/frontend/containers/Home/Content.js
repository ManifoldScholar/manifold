import Feature from "./Feature";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import { useFromStore } from "hooks";
import useFetchHomepageContent from "./useFetchHomepageContent";
import EntityCollection from "frontend/components/entity/Collection";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";

export default function Content() {
  const settings = useFromStore({ requestKey: "settings", action: "select" });

  const { hasVisibleHomeProjectCollections, hasVisibleProjects } =
    settings?.attributes?.calculated ?? {};
  const showProjects = !hasVisibleHomeProjectCollections;

  const {
    loaded,
    projects,
    collections,
    journals,
    features
  } = useFetchHomepageContent(showProjects);

  if (!loaded) return null;

  if (!projects?.length && !collections?.length && !journals?.length)
    return <EntityCollectionPlaceholder.Projects />;

  const renderCollections = collections?.length
    ? collections.map((projectCollection, i) => (
        <EntityCollection.ProjectCollectionSummary
          key={projectCollection.id}
          projectCollection={projectCollection}
          limit={projectCollection.attributes.homepageCount}
          bgColor={i % 2 === 0 ? "neutral05" : "white"}
        />
      ))
    : null;

  const renderProjects = projects?.length ? (
    <EntityCollection.ProjectsSummary projects={projects} bgColor="neutral05" />
  ) : null;

  const count = showProjects ? 1 : collections?.length;

  return (
    <>
      <Feature features={features} />
      {showProjects ? renderProjects : renderCollections}
      {!!journals?.length &&
        journals.map((journal, i) => (
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

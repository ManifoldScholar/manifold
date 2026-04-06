import lh from "helpers/linkHandler";

export const breadcrumbs = ({
  journalBreadcrumbs,
  project,
  resource,
  collection,
  t,
  pathname
}) => {
  const isCollectionMember = !!collection?.relationships?.resources?.find(
    r => r.id === resource.id
  );
  const collectionRoute =
    pathname.split("/").indexOf("resource-collection") >= 0;
  const projectCrumb = {
    to: lh.link("frontendProject", project.attributes.slug),
    label: project.attributes.titlePlaintext
  };
  const resourcesCrumb = collectionRoute
    ? {
        to: lh.link(
          "frontendProjectResourceCollections",
          project.attributes.slug
        ),
        label: t("glossary.resource_collection_other")
      }
    : {
        to: lh.link("frontendProjectResources", project.attributes.slug),
        label: t("glossary.resource_other")
      };
  const collectionCrumb =
    collectionRoute && isCollectionMember
      ? {
          to: lh.link(
            "frontendProjectResourceCollection",
            project.attributes.slug,
            collection.attributes.slug
          ),
          label: collection.attributes.title
        }
      : null;
  const currentCrumb = {
    to: lh.link(
      "frontendProjectResource",
      project.attributes.slug,
      resource.attributes.slug
    ),
    label: resource.attributes.titlePlaintext
  };
  return journalBreadcrumbs
    ? [
        ...journalBreadcrumbs,
        resourcesCrumb,
        collectionCrumb,
        currentCrumb
      ].filter(Boolean)
    : [projectCrumb, resourcesCrumb, collectionCrumb, currentCrumb].filter(
        Boolean
      );
};

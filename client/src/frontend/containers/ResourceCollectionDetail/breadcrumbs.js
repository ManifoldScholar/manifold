import lh from "helpers/linkHandler";

export const breadcrumbs = ({ journalBreadcrumbs, collection, project, t }) => {
  const projectCrumb = {
    to: lh.link("frontendProject", project.attributes.slug),
    label: project.attributes.titlePlaintext,
  };
  const resourcesCrumb = {
    to: lh.link("frontendProjectResourceCollections", project.attributes.slug),
    label: t("glossary.resource_collection_other"),
  };
  const collectionCrumb = collection
    ? {
        to: lh.link(
          "frontendProjectResourceCollection",
          project.attributes.slug,
          collection.attributes.slug,
        ),
        label: collection.attributes.title,
      }
    : null;
  return journalBreadcrumbs
    ? [...journalBreadcrumbs, resourcesCrumb, collectionCrumb].filter(Boolean)
    : [projectCrumb, resourcesCrumb, collectionCrumb].filter(Boolean);
};

import { useTranslation } from "react-i18next";
import { useMatches } from "react-router";
import OutletWithDrawers from "global/components/router/OutletWithDrawers";
import { collectionProjectsAPI, projectCollectionsAPI } from "api";
import ProjectCollection from "components/backend/project-collection";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import HeadContent from "global/components/HeadContent";
import authorize from "app/routes/utility/loaders/authorize";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import loadList from "app/routes/utility/loaders/loadList";

export const loader = async ({ params, context, request }) => {
  const projectCollection = await loadEntity({
    context,
    fetchFn: () => projectCollectionsAPI.show(params.id),
    request
  });
  await authorize({
    request,
    context,
    entity: projectCollection,
    ability: "update"
  });
  const { data: collectionProjects } = await loadList({
    request,
    context,
    fetchFn: () => collectionProjectsAPI.index(params.id),
    options: { skipPagination: true, skipFilters: true }
  });
  return { projectCollection, collectionProjects };
};

export default function ProjectCollectionDetailLayout({
  loaderData: { projectCollection, collectionProjects }
}) {
  const { t } = useTranslation();
  const matches = useMatches();

  const currentMatch = matches[matches.length - 1];
  const isManageProjectsRoute = currentMatch?.handle?.manageProjects === true;

  const drawerProps = {
    lockScroll: "always",
    size: "flexible",
    padding: isManageProjectsRoute ? "large" : "default",
    closeUrl: `/backend/projects/project-collections/${projectCollection.id}`
  };

  const breadcrumbs = [
    { to: null, label: t("glossary.project_title_case_other") },
    {
      to: "/backend/projects/project-collections",
      label: t("glossary.project_collection_title_case_other")
    },
    {
      to: `/backend/projects/project-collections/${projectCollection.id}`,
      label: projectCollection.attributes.title
    }
  ];

  return (
    <>
      <HeadContent
        title={`${projectCollection.attributes.title} | ${t("common.admin")}`}
        appendDefaultTitle
      />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <ProjectCollection.Header projectCollection={projectCollection} />
      <div>
        <h2 className="screen-reader-text">
          {t("project_collections.sr_list_title")}
        </h2>
        <ProjectCollection.SortBy projectCollection={projectCollection} />
        {projectCollection.attributes.smart ? (
          <ProjectCollection.Smart
            collectionProjects={collectionProjects}
            projectCollection={projectCollection}
          />
        ) : (
          <ProjectCollection.Manual
            collectionProjects={collectionProjects}
            projectCollection={projectCollection}
          />
        )}
        <OutletWithDrawers
          drawerProps={drawerProps}
          context={{ projectCollection, collectionProjects }}
        />
      </div>
    </>
  );
}

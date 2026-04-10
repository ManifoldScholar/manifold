import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import OutletWithDrawers from "global/components/router/OutletWithDrawers";
import classNames from "classnames";
import { projectCollectionsAPI } from "api";
import ProjectCollection from "backend/components/project-collection";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { fluidScale } from "theme/styles/mixins";
import authorize from "app/routes/utility/loaders/authorize";
import loadList from "app/routes/utility/loaders/loadList";

export const loader = async ({ request, context }) => {
  await authorize({
    request,
    context,
    ability: "update",
    entity: ["projectCollection"],
    failureMessage: "project_collections.unauthorized"
  });
  return loadList({
    request,
    context,
    fetchFn: projectCollectionsAPI.index,
    options: {
      defaultFilters: { order: "position ASC" },
      defaultPagination: { page: 1, perPage: 100 }
    }
  });
};

export default function ProjectCollectionWrapperContainer({ loaderData }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const projectCollections = loaderData.data;

  const wrapperClasses = classNames("project-collections", {
    "active-collection": id,
    empty: !projectCollections?.length
  });

  const breadcrumbs = [
    { to: null, label: t("glossary.project_title_case_other") },
    {
      to: "/backend/projects/project-collections",
      label: t("glossary.project_collection_title_case_other")
    }
  ];

  return (
    <>
      <HeadContent
        title={`${t("titles.project_collections")} | ${t("common.admin")}`}
        appendDefaultTitle
      />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <section className={wrapperClasses}>
        <div className="backend-panel">
          <div
            className="container"
            style={{ marginBlockStart: fluidScale("30px", "20px") }}
          >
            <ProjectCollection.Sidebar
              projectCollections={projectCollections}
            />
            <div className="panel">
              {!!projectCollections?.length && !id && (
                <ProjectCollection.Header projectCollection={null} />
              )}
              <div>
                <OutletWithDrawers
                  drawerProps={{
                    size: "flexible",
                    padding: "default",
                    lockScroll: "always",
                    closeUrl: "/backend/projects/project-collections"
                  }}
                  drawerCondition={!id}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

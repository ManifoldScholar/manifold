import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Link,
  Outlet,
  useParams,
  useNavigate,
  useMatches
} from "react-router-dom";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import classNames from "classnames";
import { projectCollectionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import ProjectCollection from "backend/components/project-collection";
import size from "lodash/size";
import lh from "helpers/linkHandler";
import classnames from "classnames";
import HeadContent from "global/components/HeadContent";
import IconComposer from "global/components/utility/IconComposer";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { fluidScale } from "theme/styles/mixins";
import Authorize from "hoc/Authorize";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import { useFetch, useApiCallback } from "hooks";

const { flush } = entityStoreActions;

const PROJECT_COLLECTIONS_FILTERS = { order: "position ASC" };
const PROJECT_COLLECTIONS_PAGINATION = { number: 1, size: 100 };

function ProjectCollectionWrapperContainer({ setScreenReaderStatus }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const matches = useMatches();

  const currentMatch = matches[matches.length - 1];
  const isNewRoute =
    currentMatch?.handle?.name === "backendProjectCollectionsNew";

  const {
    data: projectCollections,
    refresh: refreshProjectCollections
  } = useFetch({
    request: [
      projectCollectionsAPI.index,
      PROJECT_COLLECTIONS_FILTERS,
      PROJECT_COLLECTIONS_PAGINATION
    ],
    options: { requestKey: requests.beProjectCollections }
  });

  const { data: projectCollection } = useFetch({
    request: [projectCollectionsAPI.show, id],
    options: { requestKey: requests.beProjectCollection },
    condition: !!id && id !== "new"
  });

  const updateProjectCollection = useApiCallback(projectCollectionsAPI.update, {
    requestKey: requests.beProjectCollectionUpdate,
    noTouch: true
  });

  useEffect(() => {
    return () => {
      flush(requests.beProjectCollection);
      flush(requests.beProjectCollections);
      flush(requests.beProjects);
      flush(requests.beCollectionProjects);
    };
  }, []);

  const handleCollectionOrderChange = async result => {
    const { id: collectionId, title, position, announce, callback } = result;
    const changes = { attributes: { position } };
    const announcement = t("actions.dnd.moved_to_position", {
      title,
      position
    });

    await updateProjectCollection(collectionId, changes);
    await refreshProjectCollections();

    if (announce) {
      setScreenReaderStatus(announcement);
    }

    if (callback && typeof callback === "function") {
      callback();
    }
  };

  const handleCollectionSelect = collection => {
    const url = lh.link("backendProjectCollection", collection.id);
    navigate(url);
  };

  const handleNewSuccess = pc => {
    refreshProjectCollections();
    const path = lh.link("backendProjectCollection", pc.id);
    navigate(path);
  };

  const handleToggleVisibility = (pc, visible) => {
    const changes = { attributes: { visible } };
    updateProjectCollection(pc.id, changes);
  };

  const wrapperClasses = classnames("project-collections", {
    "active-collection": id,
    empty: size(projectCollections) === 0
  });

  const hasProjectCollections = size(projectCollections) > 0;
  const collectionForHeader = id ? projectCollection : null;
  const pageTitle = collectionForHeader
    ? collectionForHeader.attributes.title
    : t("titles.project_collections");

  const breadcrumbs = () => {
    if (collectionForHeader) {
      return [
        { to: null, label: t("glossary.project_title_case_other") },
        {
          to: lh.link("backendProjectCollections"),
          label: t("glossary.project_collection_title_case_other")
        },
        {
          to: lh.link("backendProjectCollections", projectCollection.id),
          label: projectCollection.attributes.title
        }
      ];
    }
    return [
      { to: null, label: t("glossary.project_title_case_other") },
      {
        to: lh.link("backendProjectCollections"),
        label: t("glossary.project_collection_title_case_other")
      }
    ];
  };

  return (
    <Authorize
      ability="update"
      entity={["projectCollection"]}
      failureNotification={{
        body: t("project_collections.unauthorized")
      }}
      failureRedirect
    >
      <HeadContent
        title={`${pageTitle} | ${t("common.admin")}`}
        appendDefaultTitle
      />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <section className={wrapperClasses}>
        <div className="backend-panel">
          <div
            className="container"
            style={{ marginBlockStart: fluidScale("30px", "20px") }}
          >
            <aside className="aside-wide project-collection-list">
              {hasProjectCollections && (
                <>
                  <ProjectCollection.List
                    projectCollection={projectCollection}
                    projectCollections={projectCollections}
                    onCollectionSelect={handleCollectionSelect}
                    onCollectionOrderChange={handleCollectionOrderChange}
                    onToggleVisibility={handleToggleVisibility}
                  />
                </>
              )}
              <div className="actions">
                <Link
                  className="button-icon-secondary button-icon-secondary--full"
                  to={lh.link("backendProjectCollectionsNew")}
                >
                  <IconComposer
                    icon="plus16"
                    size={20}
                    className={classNames(
                      "button-icon-secondary__icon",
                      "button-icon-secondary__icon--large"
                    )}
                  />
                  <span>{t("project_collections.create_collection")}</span>
                </Link>
              </div>
              <p className="instructional-copy">
                {t("project_collections.create_collection_instructions")}
              </p>
            </aside>
            <div className="panel">
              {hasProjectCollections && (
                <ProjectCollection.Header
                  projectCollection={collectionForHeader}
                />
              )}
              <div>
                {isNewRoute ? (
                  <OutletWithDrawer
                    drawerProps={{
                      size: "flexible",
                      padding: "default",
                      lockScroll: "always",
                      closeUrl: lh.link("backendProjectCollections")
                    }}
                    context={{
                      projectCollection,
                      handleNewSuccess
                    }}
                  />
                ) : (
                  <Outlet
                    context={{
                      projectCollection,
                      handleNewSuccess
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Authorize>
  );
}

ProjectCollectionWrapperContainer.displayName = "ProjectCollection.Wrapper";

export default withScreenReaderStatus(ProjectCollectionWrapperContainer, false);

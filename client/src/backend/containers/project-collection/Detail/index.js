import { useTranslation } from "react-i18next";
import { useOutletContext, useParams, useMatches } from "react-router-dom";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import { collectionProjectsAPI, projectCollectionsAPI, requests } from "api";
import ProjectCollection from "backend/components/project-collection";
import Manual from "./Manual";
import Smart from "./Smart";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { useFetch, useApiCallback } from "hooks";

export default function ProjectCollectionDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const matches = useMatches();
  const { projectCollection } = useOutletContext() || {};

  const {
    data: collectionProjects,
    refresh: refreshCollectionProjects
  } = useFetch({
    request: [collectionProjectsAPI.index, id],
    options: { requestKey: requests.beCollectionProjects },
    condition: !!id
  });

  const updateCollectionProject = useApiCallback(
    projectCollectionsAPI.updateCollectionProject,
    {
      requestKey: requests.beCollectionProjectUpdate,
      noTouch: true
    }
  );

  const updateProjectCollection = useApiCallback(projectCollectionsAPI.update, {
    requestKey: requests.beProjectCollectionUpdate
  });

  const handleProjectOrderChange = async result => {
    if (!projectCollection) return;
    const changes = { attributes: { position: result.position } };
    await updateCollectionProject(projectCollection.id, result.id, changes);
    refreshCollectionProjects();
  };

  const handleSortOrderChange = async order => {
    if (!projectCollection) return;
    await updateProjectCollection(projectCollection.id, {
      attributes: { sortOrder: order.sortBy }
    });
    refreshCollectionProjects();
  };

  if (!projectCollection || !collectionProjects) return null;

  const projects = collectionProjects.map(cp => cp.relationships.project);

  const currentMatch = matches[matches.length - 1];
  const isManageProjectsRoute =
    currentMatch?.handle?.name === "backendProjectCollectionManageProjects";

  const drawerProps = {
    lockScroll: "always",
    size: "flexible",
    padding: isManageProjectsRoute ? "large" : "default",
    closeUrl: lh.link("backendProjectCollection", projectCollection.id)
  };

  return (
    <Authorize
      entity={projectCollection}
      failureNotification={{
        body: t("project_collections.unauthorized_edit")
      }}
      failureRedirect
      ability="update"
    >
      <div>
        <h2 className="screen-reader-text">
          {t("project_collections.sr_list_title")}
        </h2>
        <ProjectCollection.SortBy
          sortChangeHandler={handleSortOrderChange}
          projectCollection={projectCollection}
        />
        {projectCollection.attributes.smart ? (
          <Smart projects={projects} projectCollection={projectCollection} />
        ) : (
          <Manual
            collectionProjects={collectionProjects}
            orderChangeHandler={handleProjectOrderChange}
            projectCollection={projectCollection}
          />
        )}
        <OutletWithDrawer
          drawerProps={drawerProps}
          context={{ projectCollection }}
        />
      </div>
    </Authorize>
  );
}

ProjectCollectionDetail.displayName = "ProjectCollection.Detail";

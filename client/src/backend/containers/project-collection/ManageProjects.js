import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import ProjectCollection from "backend/components/project-collection";
import { projectsAPI, collectionProjectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import EntitiesList, {
  Search,
  ProjectRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { projectFilters } from "hoc/withFilteredLists";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import IconComposer from "global/components/utility/IconComposer";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useListQueryParams, useFetch, useApiCallback } from "hooks";

function ProjectCollectionManageProjects({
  entitiesListSearchProps,
  entitiesListSearchParams,
  setScreenReaderStatus
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectCollection } = useOutletContext() || {};

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 12,
    initFilters: entitiesListSearchParams.projects,
    initSearchProps: entitiesListSearchProps("projects")
  });

  const { data: collectionProjects, refresh } = useFetch({
    request: [collectionProjectsAPI.index, projectCollection.id],
    options: { requestKey: requests.beCollectionProjects }
  });

  const { data: projects, meta: projectsMeta } = useFetch({
    request: [projectsAPI.index, filters, pagination],
    options: { requestKey: requests.beProjects }
  });

  const addCollectionProject = useApiCallback(collectionProjectsAPI.create);
  const removeCollectionProject = useApiCallback(collectionProjectsAPI.destroy);

  if (!projectsMeta) return null;

  const projectAddMessage = project => {
    const title = project.attributes.title;
    return t("project_collections.add_message", {
      title
    });
  };

  const projectRemoveMessage = project => {
    const title = project.attributes.title;
    return t("project_collections.remove_message", {
      title
    });
  };

  const collectionProjectParams = project => {
    return {
      attributes: {},
      type: "projectCollections",
      relationships: {
        project: {
          data: {
            type: "projects",
            id: project.id
          }
        }
      }
    };
  };

  const findCollectionProjectForProject = project => {
    return collectionProjects.find(cp => {
      return cp.relationships.project.id === project.id;
    });
  };

  const handleProjectAdd = async project => {
    setScreenReaderStatus(projectAddMessage(project));

    await addCollectionProject(
      projectCollection.id,
      collectionProjectParams(project)
    );

    refresh();
  };

  const handleProjectRemove = async project => {
    setScreenReaderStatus(projectRemoveMessage(project));

    const collectionProject = findCollectionProjectForProject(project);
    if (!collectionProject) return;

    await removeCollectionProject(projectCollection.id, collectionProject.id);

    refresh();
  };

  const projectCover = props => {
    const entity = props.entity;
    if (!entity) return null;
    return (
      <ProjectRow
        entity={entity}
        listStyle="grid"
        figure={
          <ProjectCollection.ProjectCover
            removeHandler={handleProjectRemove}
            addHandler={handleProjectAdd}
            {...props}
          />
        }
        renderWithoutLink
      />
    );
  };

  const handleClose = () => {
    const url = lh.link("backendProjectCollection", projectCollection.id);
    return navigate(url);
  };

  const renderProjectCount = () => {
    const count = collectionProjects.length || 0;
    const total = projectsMeta.pagination.totalCount || 0;

    return (
      <>
        <p className="list-total" aria-hidden>
          {t("project_collections.added_count", {
            total,
            count
          })}
        </p>
        {/* Better readout for screen readers */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic
          className="screen-reader-text"
        >
          {t("project_collections.added_count", {
            total,
            count
          })}
        </div>
      </>
    );
  };

  const selectedProjectIds = collectionProjects.map(
    cp => cp.relationships.project.id
  );

  const buttonClasses = classNames(
    "button-icon-secondary",
    "button-icon-secondary--full",
    "button-icon-secondary--centered",
    "button-icon-secondary--smallcaps"
  );

  const iconClasses = classNames(
    "button-icon-secondary__icon",
    "button-icon-secondary__icon--right",
    "button-icon-secondary__icon--short"
  );

  return (
    <>
      <Layout.DrawerHeader
        icon="BECollectionManual64"
        title={projectCollection.attributes.title}
        instructions={t("project_collections.manage_projects_instructions")}
      />
      <EntitiesList
        entities={projects}
        listStyle="grid"
        entityComponent={projectCover}
        entityComponentProps={{
          selectedProjectIds,
          addable: true
        }}
        pagination={projectsMeta.pagination}
        showCount={renderProjectCount()}
        search={<Search {...searchProps} />}
      />

      <div className="actions">
        <button className={buttonClasses} onClick={handleClose}>
          <span>{t("actions.close")}</span>
          <IconComposer icon="close16" size="default" className={iconClasses} />
        </button>
      </div>
    </>
  );
}

ProjectCollectionManageProjects.displayName =
  "ProjectCollection.ManageProjects";

ProjectCollectionManageProjects.propTypes = {
  entitiesListSearchProps: PropTypes.func.isRequired,
  entitiesListSearchParams: PropTypes.object.isRequired
};

export default withFilteredLists(
  withScreenReaderStatus(ProjectCollectionManageProjects),
  {
    projects: projectFilters()
  }
);

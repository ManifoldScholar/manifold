import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useOutletContext, useNavigate, useRevalidator } from "react-router";
import ProjectCollection from "components/backend/project-collection";
import { projectsAPI, collectionProjectsAPI } from "api";
import Layout from "components/backend/layout";
import EntitiesList, {
  Search,
  ProjectRow
} from "components/backend/list/EntitiesList";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import IconComposer from "global/components/utility/IconComposer";
import { useListQueryParams, useApiCallback } from "hooks";
import loadList from "app/routes/utility/loaders/loadList";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import { INIT_FILTERS, INIT_SEARCH_PROPS } from "./filters";

export const handle = { drawer: true, manageProjects: true };

export const loader = async ({ request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: projectsAPI.index,
    options: {
      defaultFilters: INIT_FILTERS,
      defaultPagination: { page: 1, perPage: 12 }
    }
  });
};

export const clientLoader = createListClientLoader({
  hydrateKey: "__manageCollectionProjectsHydrated",
  fetchFn: projectsAPI.index,
  options: {
    defaultFilters: INIT_FILTERS,
    defaultPagination: { page: 1, perPage: 12 }
  }
});

function ProjectCollectionManageProjects({
  loaderData,
  setScreenReaderStatus
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectCollection, collectionProjects } = useOutletContext() || {};
  const { revalidate } = useRevalidator();

  const { data: projects, meta: projectsMeta } = loaderData;

  const { searchProps } = useListQueryParams({
    initSize: 12,
    initFilters: INIT_FILTERS,
    initSearchProps: INIT_SEARCH_PROPS
  });

  const addCollectionProject = useApiCallback(collectionProjectsAPI.create);
  const removeCollectionProject = useApiCallback(collectionProjectsAPI.destroy);

  if (!projectsMeta) return null;

  const projectAddMessage = project => {
    const title = project.attributes.title;
    return t("project_collections.add_message", { title });
  };

  const projectRemoveMessage = project => {
    const title = project.attributes.title;
    return t("project_collections.remove_message", { title });
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

    revalidate();
  };

  const handleProjectRemove = async project => {
    setScreenReaderStatus(projectRemoveMessage(project));

    const collectionProject = findCollectionProjectForProject(project);
    if (!collectionProject) return;

    await removeCollectionProject(projectCollection.id, collectionProject.id);

    revalidate();
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
    navigate(`/backend/projects/project-collections/${projectCollection.id}`);
  };

  const renderProjectCount = () => {
    const count = collectionProjects.length || 0;
    const total = projectsMeta.pagination.totalCount || 0;

    return (
      <>
        <p className="list-total" aria-hidden>
          {t("project_collections.added_count", { total, count })}
        </p>
        <div
          role="status"
          aria-live="polite"
          aria-atomic
          className="screen-reader-text"
        >
          {t("project_collections.added_count", { total, count })}
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

export default withScreenReaderStatus(ProjectCollectionManageProjects);

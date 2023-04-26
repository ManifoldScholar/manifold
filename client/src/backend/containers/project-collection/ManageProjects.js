import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import connectAndFetch from "utils/connectAndFetch";
import ProjectCollection from "backend/components/project-collection";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, collectionProjectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import EntitiesList, {
  Search,
  ProjectRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { projectFilters } from "hoc/withFilteredLists";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import IconComposer from "global/components/utility/IconComposer";

const { request } = entityStoreActions;
const perPage = 12;

class ProjectCollectionManageProjectsImplementation extends PureComponent {
  static mapStateToProps = state => {
    return {
      projects: select(requests.beProjects, state.entityStore),
      projectsMeta: meta(requests.beProjects, state.entityStore),
      collectionProjects: select(
        requests.beCollectionProjects,
        state.entityStore
      )
    };
  };

  static displayName = "ProjectCollection.ManageProjects";

  static propTypes = {
    projectCollection: PropTypes.object.isRequired,
    projects: PropTypes.array,
    projectsMeta: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object,
    entitiesListSearchProps: PropTypes.func.isRequired,
    entitiesListSearchParams: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  componentDidMount() {
    this.fetchProjects();
    this.fetchCollectionProjects();
  }

  componentDidUpdate(prevProps) {
    if (this.filtersChanged(prevProps)) return this.fetchProjects();
  }

  get filters() {
    return this.props.entitiesListSearchParams.projects || {};
  }

  get buttonClasses() {
    return classNames(
      "button-icon-secondary",
      "button-icon-secondary--full",
      "button-icon-secondary--centered",
      "button-icon-secondary--smallcaps"
    );
  }

  get buttonclassNamees() {
    return classNames(
      "button-icon-secondary__icon",
      "button-icon-secondary__icon--right",
      "button-icon-secondary__icon--short"
    );
  }

  projectAddMessage(project) {
    const title = project.attributes.title;
    return this.props.t("project_collections.add_message", {
      title
    });
  }

  projectRemoveMessage(project) {
    const title = project.attributes.title;
    return this.props.t("project_collections.remove_message", {
      title
    });
  }

  filtersChanged(prevProps) {
    return (
      prevProps.entitiesListSearchParams !== this.props.entitiesListSearchParams
    );
  }

  projectsForProjectCollection(projectCollection) {
    return projectCollection.relationships.collectionProjects.map(
      cp => cp.relationships.project
    );
  }

  fetchCollectionProjects() {
    const action = request(
      collectionProjectsAPI.index(this.props.projectCollection.id),
      requests.beCollectionProjects
    );
    this.props.dispatch(action);
  }

  fetchProjects(eventIgnored = null, page = 1) {
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.index(this.filters, pagination),
      requests.beProjects
    );
    this.props.dispatch(action);
  }

  updateHandlerCreator = page => {
    return event => {
      this.fetchProjects(event, page);
    };
  };

  collectionProjectParams(project) {
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
  }

  findCollectionProjectForProject(project) {
    return this.props.collectionProjects.find(cp => {
      return cp.relationships.project.id === project.id;
    });
  }

  handleProjectAdd = project => {
    this.props.setScreenReaderStatus(this.projectAddMessage(project));
    const call = collectionProjectsAPI.create(
      this.props.projectCollection.id,
      this.collectionProjectParams(project)
    );
    this.props.dispatch(
      request(call, requests.beCollectionProjectsCreate, {
        adds: requests.beCollectionProjects
      })
    );
  };

  handleProjectRemove = project => {
    this.props.setScreenReaderStatus(this.projectRemoveMessage(project));
    const collectionProject = this.findCollectionProjectForProject(project);
    if (!collectionProject) return;
    const call = collectionProjectsAPI.destroy(
      this.props.projectCollection.id,
      collectionProject.id
    );
    this.props.dispatch(
      request(call, requests.beCollectionProjectsDestroy, {
        removes: collectionProject
      })
    );
  };

  projectCover = props => {
    const entity = props.entity;
    if (!entity) return null;
    return (
      <ProjectRow
        entity={entity}
        listStyle="grid"
        figure={
          <ProjectCollection.ProjectCover
            removeHandler={this.handleProjectRemove}
            addHandler={this.handleProjectAdd}
            {...props}
          />
        }
        renderWithoutLink
      />
    );
  };

  handleClose = () => {
    const url = lh.link(
      "backendProjectCollection",
      this.props.projectCollection.id
    );
    return this.props.history.push(url);
  };

  renderProjectCount(collectionProjects, projectsMeta) {
    const count = collectionProjects.length || 0;
    const total = projectsMeta.pagination.totalCount || 0;
    const t = this.props.t;

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
  }

  get selectedProjectIds() {
    return this.props.collectionProjects.map(cp => cp.relationships.project.id);
  }

  render() {
    if (!this.props.projectsMeta) return null;
    const t = this.props.t;

    return (
      <>
        <Layout.DrawerHeader
          icon="BECollectionManual64"
          title={this.props.projectCollection.attributes.title}
          instructions={t("project_collections.manage_projects_instructions")}
        />
        <EntitiesList
          entities={this.props.projects}
          listStyle="grid"
          entityComponent={this.projectCover}
          entityComponentProps={{
            selectedProjectIds: this.selectedProjectIds,
            addable: true
          }}
          pagination={this.props.projectsMeta.pagination}
          showCount={this.renderProjectCount(
            this.props.collectionProjects,
            this.props.projectsMeta
          )}
          callbacks={{
            onPageClick: this.updateHandlerCreator
          }}
          search={
            <Search {...this.props.entitiesListSearchProps("projects")} />
          }
        />

        <div className="actions">
          <button className={this.buttonClasses} onClick={this.handleClose}>
            <span>{t("actions.close")}</span>
            <IconComposer
              icon="close16"
              size="default"
              className={this.buttonclassNamees}
            />
          </button>
        </div>
      </>
    );
  }
}

export const ProjectCollectionManageProjects = withFilteredLists(
  withScreenReaderStatus(ProjectCollectionManageProjectsImplementation),
  {
    projects: projectFilters()
  }
);
export default withTranslation()(
  connectAndFetch(ProjectCollectionManageProjects)
);

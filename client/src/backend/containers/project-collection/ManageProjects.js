import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { List, ProjectCollection } from "components/backend";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, projectCollectionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;
const perPage = 12;

export class ProjectCollectionManageProjects extends PureComponent {
  static mapStateToProps = state => {
    return {
      projects: select(requests.beProjects, state.entityStore),
      projectsMeta: meta(requests.beProjects, state.entityStore)
    };
  };

  static displayName = "ProjectCollection.ManageProjects";

  static propTypes = {
    projectCollection: PropTypes.object.isRequired,
    projects: PropTypes.array,
    projectsMeta: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { filter: {} };
  }

  componentDidMount() {
    this.updateResults();
  }

  projectsForProjectCollection(projectCollection) {
    return projectCollection.relationships.collectionProjects.map(
      cp => cp.relationships.project
    );
  }

  updateResults(eventIgnored = null, page = 1) {
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.index(this.state.filter, pagination),
      requests.beProjects
    );
    this.props.dispatch(action);
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, () => {
      this.updateResults();
    });
  };

  updateHandlerCreator = page => {
    return event => {
      this.updateResults(event, page);
    };
  };

  updateProjects = projects => {
    const adjustedProjects = projects.map(project => {
      return { id: project.id, type: "projects" };
    });
    const projectCollection = {
      id: this.props.projectCollection.id,
      type: "projectCollections",
      relationships: { projects: { data: adjustedProjects } }
    };

    const call = projectCollectionsAPI.update(
      projectCollection.id,
      projectCollection
    );
    const projectCollectionRequest = request(
      call,
      requests.beProjectCollectionUpdate
    );
    this.props.dispatch(projectCollectionRequest);
  };

  handleProjectAdd = project => {
    const projects = this.projectsForProjectCollection(
      this.props.projectCollection
    );
    projects.push({ id: project.id });

    return this.updateProjects(projects);
  };

  handleProjectRemove = project => {
    const projects = this.projectsForProjectCollection(
      this.props.projectCollection
    );
    const adjusted = projects.filter(p => p.id !== project.id);

    return this.updateProjects(adjusted);
  };

  projectCover = props => {
    const entity = props.entity;
    if (!entity) return null;

    return (
      <li key={entity.id}>
        <ProjectCollection.ProjectCover
          removeHandler={this.handleProjectRemove}
          addHandler={this.handleProjectAdd}
          {...props}
        />
      </li>
    );
  };

  handleClose = () => {
    const url = lh.link(
      "backendProjectCollection",
      this.props.projectCollection.id
    );
    return this.props.history.push(url);
  };

  renderProjectCount(projectCollection, projectsMeta) {
    const added = projectCollection.attributes.projectsCount || 0;
    const total = projectsMeta.pagination.totalCount || 0;

    return (
      <div className="list-total extra-bottom">
        You have added <span>{added}</span> of <span>{total}</span> available
        projects
      </div>
    );
  }

  render() {
    if (!this.props.projectsMeta) return null;

    return (
      <React.Fragment>
        <header className="drawer-header">
          <h2 className="heading-quaternary less-space-bottom">
            <i
              className={`manicon manicon-collection-manual`}
              aria-hidden="true"
            />
            {this.props.projectCollection.attributes.title}
          </h2>
          <p className="instructions">
            Select which projects should be included in this collection. Click
            the plus sign to add a project to the collection. Click the
            checkmark to remove a project.
          </p>
        </header>
        {this.renderProjectCount(
          this.props.projectCollection,
          this.props.projectsMeta
        )}
        <List.Searchable
          defaultFilter={{ order: "sort_title ASC" }}
          listClassName="project-list grid"
          entities={this.props.projects}
          entityComponent={this.projectCover}
          entityComponentProps={{
            projectCollection: this.props.projectCollection,
            addable: true
          }}
          singularUnit="project"
          pluralUnit="projects"
          showEntityCount={false}
          pagination={this.props.projectsMeta.pagination}
          filterChangeHandler={this.filterChangeHandler}
          paginationClickHandler={this.updateHandlerCreator}
          compactPagination
        />
        <div className="actions">
          <button className="button-icon-secondary" onClick={this.handleClose}>
            <span>Close</span>
            <i className="manicon manicon-x" />
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default connectAndFetch(ProjectCollectionManageProjects);

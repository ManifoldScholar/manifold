import React, { PureComponent, PropTypes } from 'react';
import { Form, List, Resource } from 'components/backend';
import { projectsAPI } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { connect } from 'react-redux';
import { Link } from 'react-router';

const { select, meta } = entityUtils;
const { request } = entityStoreActions;
const perPage = 5;

class ProjectDetailResources extends PureComponent {

  static displayName = "ProjectDetail.Resources";
  static activeNavItem = "resources";

  static mapStateToProps(state) {
    return {
      resources: select("project-resources", state.entityStore),
      resourcesMeta: meta("project-resources", state.entityStore),
    };
  }

  static propTypes = {
    route: PropTypes.object,
    project: PropTypes.object,
    dispatch: PropTypes.func,
    editSession: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { filter: {} };
    this.lastFetchedPage = null;
    this.pageChangeHandlerCreator = this.pageChangeHandlerCreator.bind(this);
    this.filterChangeHandler = this.filterChangeHandler.bind(this);
  }

  componentDidMount() {
    this.fetchResources(1);
  }

  fetchResources(page) {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.resources(this.props.params.id, this.state.filter, pagination),
      'project-resources'
    );
    this.props.dispatch(action);
  }

  filterChangeHandler(filter) {
    this.setState({ filter }, () => {
      this.fetchResources(1);
    });
  }

  handleUsersPageChange(event, page) {
    this.fetchResources(page);
  }

  pageChangeHandlerCreator(page) {
    return (event) => {
      this.handleUsersPageChange(event, page);
    };
  }

  render() {
    if (!this.props.resources) return null;
    const project = this.props.project;

    if (!project) return null;
    return (
      <section>
        <header className="section-heading-secondary">
          <h3>
            {'Resources'} <i className="manicon manicon-cube-shine"></i>
          </h3>
        </header>
        <List.Searchable
          newButtonVisible
          newButtonPath={`/backend/project/${project.id}/resources/new`}
          newButtonText="Add a New Resource"
          entities={this.props.resources}
          singularUnit="resource"
          pluralUnit="resources"
          pagination={this.props.resourcesMeta.pagination}
          paginationClickHandler={this.pageChangeHandlerCreator}
          entityComponent={Resource.ListItem}
          filterChangeHandler={this.filterChangeHandler}
        />
      </section>
    );
  }
}

export default connect(
  ProjectDetailResources.mapStateToProps
)(ProjectDetailResources);


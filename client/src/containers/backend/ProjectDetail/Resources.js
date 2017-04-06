import React, { PureComponent, PropTypes } from 'react';
import { Form, List, Resource } from 'components/backend';
import { projectsAPI, requests } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { connect } from 'react-redux';

const { select, meta } = entityUtils;
const { request } = entityStoreActions;
const perPage = 5;

class ProjectDetailResources extends PureComponent {

  static displayName = "ProjectDetail.Resources";
  static activeNavItem = "resources";

  static mapStateToProps(state) {
    return {
      resources: select(requests.beResources, state.entityStore),
      resourcesMeta: meta(requests.beResources, state.entityStore),
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
      requests.beResources
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
          filterOptions={{
            tag: this.props.project.attributes.resourceTags,
            kind: this.props.project.attributes.resourceKinds
          }}
        />
      </section>
    );
  }
}

export default connect(
  ProjectDetailResources.mapStateToProps
)(ProjectDetailResources);


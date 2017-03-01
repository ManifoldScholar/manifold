import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Utility, Project, ResourceList } from 'components/frontend';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI, requests } from 'api';
import debounce from 'lodash/debounce';

const { select, meta } = entityUtils;
const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 10;

class ProjectResourcesContainer extends Component {

  static fetchData(getState, dispatch, location, params) {
    const pageParam = params.page ? params.page : page;
    const projectRequest =
        request(projectsAPI.show(params.id), requests.feProject);
    const resourcesRequest =
        request(projectsAPI.resources(
          params.id,
          { },
          { number: pageParam, size: perPage }),
          requests.feResources
        );
    const { promise: one } = dispatch(projectRequest);
    const { promise: two } = dispatch(resourcesRequest);
    return Promise.all([one, two]);
  }

  static propTypes = {
    project: PropTypes.object,
    resources: PropTypes.array,
    meta: PropTypes.object,
    dispatch: PropTypes.func
  };

  static mapStateToProps(state) {
    return {
      project: select(requests.feProject, state.entityStore),
      resources: select(requests.feResources, state.entityStore),
      meta: meta(requests.feResources, state.entityStore)
    };
  }

  constructor(props) {
    super(props);
    this.filterChange = this.filterChange.bind(this);
    this.updateResults = debounce(this.updateResults.bind(this), 250);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
    this.props.dispatch(flush(requests.feResources));
  }

  updateResults() {
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.resources(this.props.project.id, this.state.filter, pagination),
      requests.feResources
    );
    this.props.dispatch(action);
  }

  filterChange(filter) {
    this.setState({ filter }, () => {
      this.updateResults();
    });
  }

  render() {
    const project = this.props.project;
    if (!project) return null;
    return (
      <div>
        <section className="bg-neutral05">
          <Utility.BackLinkPrimary
            link={`/browse/project/${project.id}`}
            title={project.attributes.title}
          />
        </section>
        { this.props.resources ?
          <Project.Resources
            project={project}
            resources={this.props.resources}
            pagination={this.props.meta.pagination}
            filterChange={this.filterChange}
          />
        : null }
        <section className="bg-neutral05">
          <Utility.BackLinkSecondary
            link={`/browse/project/${project.id}`}
            title={project.attributes.title}
          />
        </section>
      </div>
    );
  }
}

const ProjectResources = connect(
    ProjectResourcesContainer.mapStateToProps
)(ProjectResourcesContainer);

export default ProjectResources;

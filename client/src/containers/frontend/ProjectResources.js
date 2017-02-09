import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Utility, Project, ResourceList } from 'components/frontend';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI } from 'api';

const { select, meta } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class ProjectResourcesContainer extends Component {

  static fetchData(getState, dispatch, location, params) {
    const page = params.page ? params.page : 1;
    const projectRequest =
        request(projectsAPI.show(params.id), requests.showProjectDetail);
    const resourcesRequest =
        request(projectsAPI.resources(params.id, { }, { number: page }), requests.projectResources);
    const { promise: one } = dispatch(projectRequest);
    const { promise: two } = dispatch(resourcesRequest);
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    return {
      project: select(requests.showProjectDetail, state.entityStore),
      resources: select(requests.projectResources, state.entityStore),
      meta: meta(requests.projectResources, state.entityStore)
    };
  }

  static propTypes = {
    project: PropTypes.object,
    resources: PropTypes.array,
    meta: PropTypes.object
  };

  render() {
    const project = this.props.project;
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

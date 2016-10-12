import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Utility, ResourceList } from 'components/frontend';
import fakeData from 'helpers/fakeData';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI } from 'api';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class ProjectResourcesContainer extends Component {
  static fetchData(getState, dispatch, location, params) {
    const projectRequest =
        request(projectsAPI.show(params.id), requests.showProjectDetail);
    const { promise: one } = dispatch(projectRequest);
    return Promise.all([one]);
  }

  static mapStateToProps(state) {
    return {
      project: select(requests.showProjectDetail, state.entityStore)
    };
  }

  static propTypes = {
    project: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      resources: fakeData.resources
    };
  }

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
        <section>
          <div className="container">
            <header className="section-heading">
              <h2 className="title">
                <i className="manicon manicon-cube-shine"></i>
                All Project Resources
              </h2>
            </header>

            <ResourceList.Filters />
            <ResourceList.Cards resources={this.state.resources} />
          </div>
        </section>

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

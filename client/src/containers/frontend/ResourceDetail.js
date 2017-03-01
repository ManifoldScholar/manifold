import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Resource, Utility } from 'components/frontend';

import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI, resourcesAPI, requests } from 'api';

const { select } = entityUtils;
const { request, flush } = entityStoreActions;

class ResourceDetailContainer extends PureComponent {
  static fetchData(getState, dispatch, location, params) {
    const page = params.page ? params.page : 1;
    const projectFetch = projectsAPI.show(params.id);
    const resourceFetch = resourcesAPI.show(params.resourceId);
    const projectAction = request(projectFetch, requests.feProject);
    const resourceAction = request(resourceFetch, requests.feResource);
    const { promise: one } = dispatch(projectAction);
    const { promise: two } = dispatch(resourceAction);
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    const props = {
      project: select(requests.feProject, state.entityStore),
      resource: select(requests.feResource, state.entityStore)
    };
    return props;
  }

  static propTypes = {
    project: PropTypes.object,
    resource: PropTypes.object
  };

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
    this.props.dispatch(flush(requests.feResource));
  }

  projectUrl() {
    const pid = this.props.project.id;
    return `/browse/project/${pid}/resources`;
  }

  render() {
    const projectId = this.props.project ? this.props.project.id : null;
    if (!projectId) return null;
    return (
      <div>
        {this.props.project ?
          <Utility.BackLinkPrimary
            backText="Back to Project Resources"
            link={this.projectUrl()}
            title={this.props.project.attributes.title}
          /> : null
        }
        {this.props.resource ?
          <Resource.Detail
            projectId={projectId}
            projectUrl={this.projectUrl()}
            resource={this.props.resource}
          /> : null
        }
        {this.props.project ?
          <section className="bg-neutral05">
            <Utility.BackLinkSecondary
              backText="Back to Project Resources"
              link={this.projectUrl()}
            />
          </section> : null
        }
      </div>
    );
  }
}

const ResourceDetail = connect(
    ResourceDetailContainer.mapStateToProps
)(ResourceDetailContainer);

export default ResourceDetail;

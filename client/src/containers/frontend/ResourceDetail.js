import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Resource, Utility } from 'components/frontend';

import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI, resourcesAPI } from 'api';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class ResourceDetailContainer extends PureComponent {
  static fetchData(getState, dispatch, location, params) {
    const page = params.page ? params.page : 1;
    const projectFetch = projectsAPI.show(params.id);
    const resourceFetch = resourcesAPI.show(params.resourceId);
    const projectAction = request(projectFetch, 'show-project-detail');
    const resourceAction = request(resourceFetch, 'show-resource-detail');
    const { promise: one } = dispatch(projectAction);
    const { promise: two } = dispatch(resourceAction);
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    const props = {
      project: select('show-project-detail', state.entityStore),
      resource: select('show-resource-detail', state.entityStore)
    };
    return props;
  }

  static propTypes = {
    project: PropTypes.object,
    resource: PropTypes.object
  };

  projectUrl() {
    const pid = this.props.project.id;
    return `/browse/project/${pid}/resources`;
  }

  render() {
    const projectId = this.props.project ? this.props.project.id : null;
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

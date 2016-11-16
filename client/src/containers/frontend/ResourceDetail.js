import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import fakeData from 'helpers/fakeData';
import {
    Resource
} from 'components/frontend';

import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI, resourcesAPI } from 'api';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class ResourceDetailContainer extends PureComponent {
  static fetchData(getState, dispatch, location, params) {
    const page = params.page ? params.page : 1;
    const {
        showProjectDetail,
        showResourceDetail,
        } = requests;
    const projectRequest =
        request(projectsAPI.show(params.id), showProjectDetail);
    const resourceRequest =
        request(resourcesAPI.show(params.resourceId), showResourceDetail);

    const { promise: one } = dispatch(projectRequest);
    const { promise: two } = dispatch(resourceRequest);
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    const props = {
      project: select(requests.showProjectDetail, state.entityStore),
      resource: select(requests.showResourceDetail, state.entityStore)
    };

    return props;

  }

  static propTypes = {
    project: PropTypes.object,
    resource: PropTypes.object
  };


  render() {
    const projectId = this.props.project ? this.props.project.id : null;
    return (
      <div>
        {this.props.resource ?
          <Resource.Detail
            projectId={projectId}
            resource={this.props.resource}
          /> : null
        }
      </div>
    );
  }
}

const ResourceDetail = connect(
    ResourceDetailContainer.mapStateToProps
)(ResourceDetailContainer);

export default ResourceDetail;

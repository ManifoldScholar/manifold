import React, { PureComponent, PropTypes } from 'react';
import update from 'immutability-helper';
import { resourcesAPI } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { connect } from 'react-redux';
import { Section, Resource } from 'components/reader';

const { select, meta } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class ResourceDetailContainer extends PureComponent {

  static displayName = "ReaderContainer.Resource.Detail";

  static fetchData(getState, dispatch, location, params) {
    const promises = [];
    const resourceCall = resourcesAPI.show(params.resourceId);
    const { promise: one } = dispatch(request(resourceCall, requests.rResource));
    promises.push(one);
    return Promise.all(promises);
  }

  static mapStateToProps(state, ownProps) {
    const newState = {
      resource: select(requests.rResource, state.entityStore),
      resourceMeta: meta(requests.rResource, state.entityStore),
    };
    return Object.assign({}, newState, ownProps);
  }

  static propTypes = {
    route: PropTypes.object,
    params: PropTypes.object,
    resource: PropTypes.object,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.rResource));
  }

  render() {
    if (!this.props.resource) return null;

    return (
       <Resource.Overlay
         params={this.props.params}
         resource={this.props.resource}
       />
    );
  }
}

export default connect(
  ResourceDetailContainer.mapStateToProps
)(ResourceDetailContainer);


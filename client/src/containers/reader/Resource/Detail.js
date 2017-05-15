import React, { PureComponent, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { resourcesAPI, requests } from 'api';
import { entityStoreActions } from 'actions';
import { select, meta } from 'utils/entityUtils';
import { Section, Resource } from 'components/reader';

const { request, flush } = entityStoreActions;

export class ResourceDetailContainer extends PureComponent {

  static displayName = "ReaderContainer.Resource.Detail";

  static fetchData(getState, dispatch, location, match) {
    const promises = [];
    const resourceCall = resourcesAPI.show(match.params.resourceId);
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
    match: PropTypes.object,
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
         history={this.props.history}
         match={this.props.match}
         resource={this.props.resource}
       />
    );
  }
}

export default connectAndFetch(ResourceDetailContainer);


import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { resourceCollectionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, meta, loaded } from "utils/entityUtils";
import Overlay from "global/components/Overlay";
import EntityCollection from "frontend/components/entity/Collection";
import lh from "helpers/linkHandler";

const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 10;

export class NotationResourceCollectionDetailContainer extends PureComponent {
  static fetchData = (getState, dispatch, location, match) => {
    const state = getState();
    const promises = [];
    const resourceCall = resourceCollectionsAPI.show(
      match.params.resourceCollectionId
    );
    const { promise: one } = dispatch(
      request(resourceCall, requests.rResourceCollection)
    );
    promises.push(one);

    // Load the collection resources, unless they have already been loaded
    if (!loaded(requests.feCollectionResources, state.entityStore)) {
      const pp = match.params.page ? match.params.page : page;
      const cr = resourceCollectionsAPI.collectionResources(
        match.params.resourceCollectionId,
        {},
        { number: pp, size: perPage }
      );
      const lookups = [requests.feSlideshow, requests.feCollectionResources];
      const { promise } = dispatch(request(cr, lookups));
      promises.push(promise);
    }
    return Promise.all(promises);
  };

  static mapStateToProps = (state, ownProps) => {
    const newState = {
      resourceCollection: select(
        requests.rResourceCollection,
        state.entityStore
      ),
      slideshowResources: select(requests.feSlideshow, state.entityStore),
      slideshowResourcesMeta: meta(requests.feSlideshow, state.entityStore)
    };
    return { ...newState, ...ownProps };
  };

  static displayName = "ReaderContainer.Notation.ResourceCollection.Detail";

  static propTypes = {
    route: PropTypes.object,
    match: PropTypes.object,
    resourceCollection: PropTypes.object,
    slideshowResources: PropTypes.array,
    slideshowResourcesMeta: PropTypes.object,
    dispatch: PropTypes.func,
    history: PropTypes.object
  };

  componentWillUnmount() {
    this.props.dispatch(flush(requests.rResourceCollection));
    this.props.dispatch(flush(requests.feCollectionResources));
  }

  handleClose = event => {
    if (event) event.preventDefault();
    const { textId, sectionId } = this.props.match.params;
    this.props.history.push(lh.link("readerSection", textId, sectionId), {
      noScroll: true
    });
  };

  render() {
    const {
      resourceCollection,
      slideshowResources,
      slideshowResourcesMeta,
      dispatch
    } = this.props;

    if (!resourceCollection || !slideshowResources) return null;

    return (
      <Overlay
        closeCallback={this.handleClose}
        appearance="overlay-full bg-neutral90"
      >
        <div className="notation-detail">
          <EntityCollection.ProjectResourceCollectionSlideshow
            resourceCollection={resourceCollection}
            slideshowResources={slideshowResources}
            slideshowResourcesMeta={slideshowResourcesMeta}
            dispatch={dispatch}
            handleClose={this.handleClose}
          />
        </div>
      </Overlay>
    );
  }
}

export default connectAndFetch(NotationResourceCollectionDetailContainer);

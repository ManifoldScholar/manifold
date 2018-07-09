import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { collectionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, meta, loaded } from "utils/entityUtils";
import { Overlay } from "components/global";
import { Notation } from "components/reader";
import lh from "helpers/linkHandler";

const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 10;

export class NotationCollectionDetailContainer extends PureComponent {
  static displayName = "ReaderContainer.Notation.Collection.Detail";

  static fetchData = (getState, dispatch, location, match) => {
    const state = getState();
    const promises = [];
    const resourceCall = collectionsAPI.show(match.params.collectionId);
    const { promise: one } = dispatch(
      request(resourceCall, requests.rCollection)
    );
    promises.push(one);

    // Load the collection resources, unless they have already been loaded
    if (!loaded(requests.feCollectionResources, state.entityStore)) {
      const pp = match.params.page ? match.params.page : page;
      const cr = collectionsAPI.collectionResources(
        match.params.collectionId,
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
      collection: select(requests.rCollection, state.entityStore),
      slideshowResources: select(requests.feSlideshow, state.entityStore),
      slideshowResourcesMeta: meta(requests.feSlideshow, state.entityStore)
    };
    return Object.assign({}, newState, ownProps);
  };

  static propTypes = {
    route: PropTypes.object,
    match: PropTypes.object,
    collection: PropTypes.object,
    slideshowResources: PropTypes.array,
    slideshowResourcesMeta: PropTypes.object,
    dispatch: PropTypes.func,
    history: PropTypes.object
  };

  componentWillUnmount() {
    this.props.dispatch(flush(requests.rCollection));
    this.props.dispatch(flush(requests.feCollectionResources));
  }

  handleClose = event => {
    if (event) event.preventDefault();
    const { textId, sectionId } = this.props.match.params;
    this.props.history.push(lh.link("readerSection", textId, sectionId));
  };

  render() {
    if (!this.props.collection || !this.props.slideshowResources) return null;
    return (
      <Overlay
        closeCallback={this.handleClose}
        appearance="overlay-full bg-neutral90"
      >
        <div className="notation-detail">
          <Notation.Collection.Detail
            dispatch={this.props.dispatch}
            collection={this.props.collection}
            slideshowResources={this.props.slideshowResources}
            slideshowPagination={this.props.slideshowResourcesMeta.pagination}
            handleClose={this.handleClose}
          />
        </div>
      </Overlay>
    );
  }
}

export default connectAndFetch(NotationCollectionDetailContainer);

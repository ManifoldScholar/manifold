import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { projectCollectionsAPI, requests } from "api";
import EntityCollection from "global/components/composed/EntityCollection";

const { request } = entityStoreActions;

export class HomeCollectionsContainer extends Component {
  // This method is called by the Home Container, since its fetchData is exposed to the
  // SSR because it's a top-level route. Code is here so that it's closer to where it's
  // actually used.
  static fetchCollections(getState, dispatch) {
    const collectionRequest = request(
      projectCollectionsAPI.index({
        visibleOnHomepage: true,
        order: "position ASC"
      }),
      requests.feProjectCollections
    );
    const { promise } = dispatch(collectionRequest);
    return promise;
  }

  static mapStateToProps(state) {
    return {
      projectCollections: select(
        requests.feProjectCollections,
        state.entityStore
      ),
      authentication: state.authentication
    };
  }

  static propTypes = {
    projectCollections: PropTypes.array,
    authentication: PropTypes.object,
    dispatch: PropTypes.func
  };

  get projectCollections() {
    return this.props.projectCollections;
  }

  render() {
    if (!this.projectCollections) return null;

    return this.projectCollections.map((projectCollection, index) => (
      <EntityCollection.ProjectCollectionSummary
        key={projectCollection.id}
        projectCollection={projectCollection}
        limit={projectCollection.attributes.homepageCount}
        bgColor={index % 2 === 0 ? "neutral05" : "white"}
      />
    ));
  }
}

export default connectAndFetch(HomeCollectionsContainer);

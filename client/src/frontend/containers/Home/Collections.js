import React, { Component } from "react";
import PropTypes from "prop-types";
import ProjectCollection from "frontend/components/project-collection";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { projectCollectionsAPI, requests } from "api";

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

  render() {
    if (!this.props.projectCollections) return null;

    return this.props.projectCollections.map((projectCollection, index) => {
      return (
        <ProjectCollection.Summary
          key={projectCollection.id}
          authentication={this.props.authentication}
          projectCollection={projectCollection}
          dispatch={this.props.dispatch}
          ordinal={index}
        />
      );
    });
  }
}

export default connectAndFetch(HomeCollectionsContainer);

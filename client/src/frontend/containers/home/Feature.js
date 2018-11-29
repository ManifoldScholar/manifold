import React, { Component } from "react";
import PropTypes from "prop-types";
import Layout from "frontend/components/layout";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { featuresAPI, requests } from "api";
import isArray from "lodash/isArray";

const { request } = entityStoreActions;

export class HomeFeatureContainer extends Component {
  // This method is called by the Home Container, since its fetchData is exposed to the
  // SSR because it's a top-level route. Code is here so that it's closer to where it's
  // actually used.
  static fetchFeatures(getState, dispatch) {
    const featuresRequest = request(
      featuresAPI.index({ home: true }),
      requests.feFeatures
    );
    const { promise } = dispatch(featuresRequest);
    return promise;
  }

  static mapStateToProps(state) {
    return {
      features: select(requests.feFeatures, state.entityStore)
    };
  }

  static propTypes = {
    features: PropTypes.array,
    authentication: PropTypes.object,
    commonActions: PropTypes.object
  };

  get feature() {
    return isArray(this.props.features) ? this.props.features[0] : null;
  }

  render() {
    if (!this.feature) return null;

    return (
      <Layout.Splash
        feature={this.feature}
        authenticated={this.props.authentication.authenticated}
        toggleSignInUpOverlay={this.props.commonActions.toggleSignInUpOverlay}
      />
    );
  }
}

export default connectAndFetch(HomeFeatureContainer);

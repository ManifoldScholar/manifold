import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { grab } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { RedirectToFirstMatch, childRoutes } from "helpers/router";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import withSettings from "hoc/with-settings";
import EventTracker, { EVENTS } from "global/components/EventTracker";

const { request } = entityStoreActions;

export class VolumeWrapper extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const volumeRequest = request(
      projectsAPI.show(match.params.id),
      requests.feProject
    );
    const { promise: one } = dispatch(volumeRequest);
    return Promise.all([one]);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      volume: grab("projects", ownProps.match.params.id, state.entityStore),
      volumeResponse: get(state.entityStore.responses, requests.feProject)
    };
  };

  static propTypes = {
    route: PropTypes.object,
    volume: PropTypes.object,
    volumeResponse: PropTypes.object,
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    fetchData: PropTypes.func
  };

  renderRoutes() {
    const {
      route,
      volume,
      volumeResponse,
      settings,
      dispatch,
      fetchData
    } = this.props;

    return childRoutes(route, {
      childProps: {
        volume,
        volumeResponse,
        settings,
        dispatch,
        fetchData
      }
    });
  }

  get isVolumeHomepage() {
    return this.props.location.pathname === this.props.match.url;
  }

  render() {
    return (
      <>
        {this.props.volume && (
          <EventTracker
            event={EVENTS.VIEW_RESOURCE}
            resource={this.props.volume}
          />
        )}
        <CheckFrontendMode
          debugLabel="VolumeWrapper"
          project={this.props.volume}
          isProjectHomePage={this.isVolumeHomepage}
        />
        <RedirectToFirstMatch
          from={lh.link("frontendVolumeDetail")}
          candidates={[
            {
              label: "Volume Detail",
              route: "frontendVolumeDetail"
            }
          ]}
        />
        {this.renderRoutes()}
      </>
    );
  }
}

export default connectAndFetch(withSettings(VolumeWrapper));

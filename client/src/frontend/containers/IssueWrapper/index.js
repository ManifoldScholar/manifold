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

export class IssueWrapper extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const issueRequest = request(
      projectsAPI.show(match.params.id),
      requests.feProject
    );
    const { promise: one } = dispatch(issueRequest);
    return Promise.all([one]);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      issue: grab("projects", ownProps.match.params.id, state.entityStore),
      issueResponse: get(state.entityStore.responses, requests.feProject)
    };
  };

  static propTypes = {
    route: PropTypes.object,
    issue: PropTypes.object,
    issueResponse: PropTypes.object,
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    fetchData: PropTypes.func
  };

  renderRoutes() {
    const {
      route,
      issue,
      issueResponse,
      settings,
      dispatch,
      fetchData
    } = this.props;

    return childRoutes(route, {
      childProps: {
        issue,
        issueResponse,
        settings,
        dispatch,
        fetchData
      }
    });
  }

  get isIssueHomepage() {
    return this.props.location.pathname === this.props.match.url;
  }

  render() {
    return (
      <>
        {this.props.issue && (
          <EventTracker
            event={EVENTS.VIEW_RESOURCE}
            resource={this.props.issue}
          />
        )}
        <CheckFrontendMode
          debugLabel="IssueWrapper"
          project={this.props.issue}
          isProjectHomePage={this.isIssueHomepage}
        />
        <RedirectToFirstMatch
          from={lh.link("frontendIssue")}
          candidates={[
            {
              label: "All Journal Issues",
              route: "frontendIssuesList"
            }
          ]}
        />
        {this.renderRoutes()}
      </>
    );
  }
}

export default connectAndFetch(withSettings(IssueWrapper));

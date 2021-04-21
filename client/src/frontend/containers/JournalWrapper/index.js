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

export class JournalWrapper extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const journalRequest = request(
      projectsAPI.show(match.params.id),
      requests.feProject
    );
    const { promise: one } = dispatch(journalRequest);
    return Promise.all([one]);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      journal: grab("projects", ownProps.match.params.id, state.entityStore),
      journalResponse: get(state.entityStore.responses, requests.feProject)
    };
  };

  static propTypes = {
    route: PropTypes.object,
    journal: PropTypes.object,
    journalResponse: PropTypes.object,
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    fetchData: PropTypes.func
  };

  renderRoutes() {
    const {
      route,
      journal,
      journalResponse,
      settings,
      dispatch,
      fetchData
    } = this.props;

    return childRoutes(route, {
      childProps: {
        journal,
        journalResponse,
        settings,
        dispatch,
        fetchData
      }
    });
  }

  get isJournalHomepage() {
    return this.props.location.pathname === this.props.match.url;
  }

  render() {
    return (
      <>
        {this.props.journal && (
          <EventTracker
            event={EVENTS.VIEW_RESOURCE}
            resource={this.props.journal}
          />
        )}
        <CheckFrontendMode
          debugLabel="IssueWrapper"
          project={this.props.journal}
          isProjectHomePage={this.isIssueHomepage}
        />
        <RedirectToFirstMatch
          from={lh.link("frontendIssue")}
          candidates={[
            {
              label: "All Journals",
              route: "frontendJournalDetail"
            }
          ]}
        />
        {this.renderRoutes()}
      </>
    );
  }
}

export default connectAndFetch(withSettings(JournalWrapper));

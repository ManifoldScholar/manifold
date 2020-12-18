import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

const { request } = entityStoreActions;

export class AnalyticsContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      statistics: select(requests.beVersions, state.entityStore),
      versionsMeta: meta(requests.beVersions, state.entityStore)
    };
  };

  static displayName = "Project.Analytics";

  static propTypes = {
    project: PropTypes.object.isRequired,
    dispatch: PropTypes.func
  };

  componentDidMount() {
    this.fetchAnalytics();
  }

  fetchAnalytics(page) {
    const action = request(
      projectsAPI.analytics(this.props.project.id),
      requests.beProjectAnalytics
    );
    this.props.dispatch(action);
  }

  render() {
    const project = this.props.project;

    return (
      <Authorize
        entity={project}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        The thing is here
      </Authorize>
    );
  }
}
export default connect(AnalyticsContainer.mapStateToProps)(AnalyticsContainer);

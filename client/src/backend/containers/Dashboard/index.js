import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Dashboards from "backend/containers/dashboards";
import lh from "helpers/linkHandler";
import Authorize from "hoc/authorize";

export default class DashboardContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  render() {
    // This will be the entry point to the author dashboard too, when built out more
    return (
      <Authorize
        kind={[
          "admin",
          "editor",
          "marketeer",
          "project_creator",
          "project_editor",
          "project_resource_editor"
        ]}
        failureRedirect={lh.link("frontend")}
        failureNotification
      >
        <Dashboards.Admin />
      </Authorize>
    );
  }
}

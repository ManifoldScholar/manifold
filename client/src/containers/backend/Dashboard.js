import React, { PureComponent } from "react";
import { HigherOrder } from "containers/global";
import { Dashboards } from "containers/backend";
import lh from "helpers/linkHandler";

export default class DashboardContainer extends PureComponent {
  render() {
    // This will be the entry point to the author dashboard too, when built out more
    return (
      <HigherOrder.Authorize
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
      </HigherOrder.Authorize>
    );
  }
}

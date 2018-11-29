import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderRoutes } from "react-router-config";
import { RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";

export default class ProjectsWrapper extends Component {
  static propTypes = {
    route: PropTypes.object
  };

  render() {
    return (
      <div>
        <RedirectToFirstMatch
          from={lh.link("frontendProjects")}
          candidates={[
            {
              label: "All Projects",
              route: "frontendProjectsAll"
            }
          ]}
        />
        {renderRoutes(this.props.route.routes)}
      </div>
    );
  }
}

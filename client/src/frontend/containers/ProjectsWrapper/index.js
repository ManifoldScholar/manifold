import React, { Component } from "react";
import PropTypes from "prop-types";
import { RedirectToFirstMatch, childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";

export default class ProjectsWrapper extends Component {
  static propTypes = {
    route: PropTypes.object,
    standaloneMode: PropTypes.shape({
      project: PropTypes.object
    })
  };

  renderRoutes() {
    const { standaloneMode } = this.props;
    return childRoutes(this.props.route, {
      childProps: { standaloneMode }
    });
  }

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
        {this.renderRoutes()}
      </div>
    );
  }
}

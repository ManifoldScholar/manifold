import React, { Component } from "react";
import PropTypes from "prop-types";
import { Project } from "components/frontend";

export default class ProjectListCoversGrid extends Component {
  static displayName = "ProjectList.CoversGrid";

  static propTypes = {
    authenticated: PropTypes.bool,
    favorites: PropTypes.object,
    projects: PropTypes.array,
    dispatch: PropTypes.func
  };

  render() {
    const hideMeta = true;
    return (
      <nav className="grid-project-covers">
        <ul>
          {this.props.projects.map(project => {
            return (
              <li key={project.id}>
                <Project.Thumbnail
                  authenticated={this.props.authenticated}
                  favorites={this.props.favorites}
                  project={project}
                  hideMeta={hideMeta}
                  dispatch={this.props.dispatch}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

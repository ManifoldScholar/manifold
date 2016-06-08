import React, { Component, PropTypes } from 'react';
import { ProjectThumb } from 'components/frontend';

export default class ProjectCovers extends Component {

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
          {this.props.projects.map((project) => {
            return (
              <li key={project.id}>
                <ProjectThumb
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

import React, { Component, PropTypes } from 'react';
import { ProjectThumb } from 'components/frontend';

export default class ProjectGrid extends Component {

  static propTypes = {
    projects: PropTypes.array,
    authenticated: PropTypes.bool,
    favorites: PropTypes.object,
    dispatch: PropTypes.func
  };

  render() {
    const hideDesc = true;
    return (
      <nav className="grid-project">
        <ul>
          {this.props.projects.map((project) => {
            return (
              <li key={project.id} >
                <ProjectThumb
                  authenticated={this.props.authenticated}
                  favorites={this.props.favorites}
                  dispatch={this.props.dispatch}
                  project={project}
                  hideDesc={hideDesc}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

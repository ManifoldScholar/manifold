import React, { Component, PropTypes } from 'react';
import { ProjectThumb } from './';

export default class ProjectCovers extends Component {

  static propTypes = {
    projects: PropTypes.array
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
                  project={project}
                  hideMeta={hideMeta}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

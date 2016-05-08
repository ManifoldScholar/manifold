import React, { Component, PropTypes } from 'react';
import { ProjectThumb } from './';

export default class ProjectGrid extends Component {

  static propTypes = {
    projects: PropTypes.array
  };

  render() {
    const hideDesc = true;
    return (
      <nav className="grid-project">
        <ul>
          {this.props.projects.map((project) => {
            return (
              <li key={project.id} >
                <ProjectThumb project={project} hideDesc={hideDesc} />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

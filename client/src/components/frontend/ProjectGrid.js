import React, { Component, PropTypes } from 'react';
import {ProjectThumb} from './';

export default class ProjectGrid extends Component {

  static propTypes = {
    entities: PropTypes.array,
    projects: PropTypes.object,
    makers: PropTypes.object
  };

  lookupProject(id) {
    return this.props.projects[id];
  }

  render() {
    const hideDesc = true;
    return (
      <nav className="grid-project">
        <ul>
          {this.props.entities.map((projectId) => {
            const project = this.lookupProject(projectId);
            return (
              <li key={projectId} >
                <ProjectThumb makers={this.props.makers}
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

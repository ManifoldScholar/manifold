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
    const hideDate = true;
    return (
      <nav className="grid-project-summary">
        <ul>
          {this.props.entities.map((projectId) => {
            const project = this.lookupProject(projectId);
            return (
              <li>
                <ProjectThumb makers={this.props.makers}
                              project={project}
                              hideDate={hideDate}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

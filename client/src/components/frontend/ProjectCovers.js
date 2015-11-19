import React, { Component, PropTypes } from 'react';
import {ProjectThumb} from './';

export default class ProjectCovers extends Component {

  static propTypes = {
    entities: PropTypes.array,
    projects: PropTypes.object,
    makers: PropTypes.object
  };

  lookupProject(id) {
    return this.props.projects[id];
  }

  render() {
    const hideMeta = true;
    return (
      <nav className="grid-project-covers">
        <ul>
          {this.props.entities.map((projectId) => {
            const project = this.lookupProject(projectId);
            return (
              <li>
                <ProjectThumb makers={this.props.makers}
                              project={project}
                              hideMeta="{hideMeta}"
                />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

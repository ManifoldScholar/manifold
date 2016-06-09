import React, { Component, PropTypes } from 'react';
import { ProjectThumb } from 'components/frontend';

export default class ProjectSummaryGrid extends Component {

  static propTypes = {
    projects: PropTypes.array
  };

  render() {
    const hideDate = true;
    return (
      <nav className="grid-project-summary">
        <ul>
          {this.props.projects.map((project) => {
            return (
              <li key={project.id} >
                <ProjectThumb project={project} hideDate={hideDate} />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

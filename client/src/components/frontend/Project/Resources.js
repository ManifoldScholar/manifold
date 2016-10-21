import React, { Component, PropTypes } from 'react';
import { ResourceList } from 'components/frontend';

export default class ProjectResources extends Component {

  static displayName = "Project.Resources"

  static propTypes = {
    project: PropTypes.object,
    resources: PropTypes.array
  };

  render() {
    return (
      <section>
        <div className="container">
          <header className="section-heading">
            <h2 className="title">
              <i className="manicon manicon-cube-shine"></i>
              All Project Resources
            </h2>
          </header>
          <ResourceList.Filters />
          <ResourceList.Cards resources={this.props.resources} projectId={this.props.project.id} />
        </div>
      </section>
    );
  }
}

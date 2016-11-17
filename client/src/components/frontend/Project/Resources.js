import React, { Component, PropTypes } from 'react';
import { ResourceList } from 'components/frontend';

export default class ProjectResources extends Component {

  static displayName = "Project.Resources"

  static propTypes = {
    project: PropTypes.object,
    resources: PropTypes.array,
    pagination: PropTypes.object
  };

  constructor() {
    super();
    this.paginationClickHandler = this.paginationClickHandler.bind(this);
  }

  paginationClickHandler(page) {
    return `/browse/project/${this.props.project.id}/resources/${page}`;
  }

  render() {
    const project = this.props.project;
    return (
      <section>
        <div className="container">
          <header className="section-heading">
            <h2 className="title">
              <i className="manicon manicon-cube-shine"></i>
              All Project Resources
            </h2>
          </header>
          <ResourceList.Filters kinds={project.attributes.resourceKinds} />
          <ResourceList.Cards
            context={project}
            pagination={this.props.pagination}
            resources={this.props.resources}
            projectId={project.id}
            paginationClickHandler={this.paginationClickHandler}
          />
        </div>
      </section>
    );
  }
}

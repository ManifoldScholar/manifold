import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResourceList } from 'components/frontend';

export default class ProjectResources extends Component {

  static displayName = "Project.Resources";

  static propTypes = {
    project: PropTypes.object,
    resources: PropTypes.array,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func,
    filterChange: PropTypes.func.isRequired,
    initialFilterState: PropTypes.object
  };

  constructor() {
    super();
  }

  render() {
    const project = this.props.project;
    return (
      <section>
        <div className="container">
          <header className="section-heading">
            <h2 className="title">
              <i className="manicon manicon-cube-shine" />
              All Project Resources
            </h2>
          </header>
          <ResourceList.Filters
            kinds={project.attributes.resourceKinds}
            tags={project.attributes.resourceTags}
            filterChangeHandler={this.props.filterChange}
            initialFilterState={this.props.initialFilterState}
          />
          <ResourceList.Cards
            context={project}
            pagination={this.props.pagination}
            resources={this.props.resources}
            projectId={project.id}
            paginationClickHandler={this.props.paginationClickHandler}
          />
        </div>
      </section>
    );
  }
}

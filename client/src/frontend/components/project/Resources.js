import React, { Component } from "react";
import PropTypes from "prop-types";
import { ResourceList } from "components/frontend";

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

  render() {
    const project = this.props.project;
    return (
      <section>
        <div className="container">
          <header className="section-heading">
            <div className="main">
              <i className="manicon manicon-cube-shine" aria-hidden="true" />
              <div className="body">
                <h2 className="title">All Project Resources</h2>
              </div>
            </div>
          </header>
          <ResourceList.Filters
            kinds={project.attributes.resourceKinds}
            tags={project.attributes.resourceTags}
            filterChangeHandler={this.props.filterChange}
            initialFilterState={this.props.initialFilterState}
            project={project}
          />
          <ResourceList.Cards
            project={project}
            pagination={this.props.pagination}
            resources={this.props.resources}
            paginationClickHandler={this.props.paginationClickHandler}
          />
        </div>
      </section>
    );
  }
}

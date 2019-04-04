import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourceList from "frontend/components/resource-list";
import Utility from "global/components/utility";

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
        <div className="entity-section-wrapper container">
          <header className="entity-section-wrapper__heading section-heading">
            <div className="main">
              <Utility.IconComposer icon="resources64" size={56} />
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

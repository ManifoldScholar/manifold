import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Resource from "./Resource";

export default class ProjectDetailResourcesContainer extends PureComponent {
  static displayName = "ProjectDetail.ResourcesContainer";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;
    if (!project) return null;

    return (
      <section>
        <Resource.ResourcesList project={project} />
      </section>
    );
  }
}

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Resource from "./Resource";

export default class ProjectCollectionsContainer extends PureComponent {
  static displayName = "Project.CollectionsContainer";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;
    if (!project) return null;

    return (
      <section>
        <Resource.CollectionsList project={project} />
      </section>
    );
  }
}

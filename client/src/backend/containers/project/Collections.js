import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Resource from "./Resource";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

export default class ProjectCollectionsContainer extends PureComponent {
  static displayName = "Project.CollectionsContainer";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;
    if (!project) return null;

    return (
      <Authorize
        entity={project}
        ability="manageCollections"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section>
          <Resource.CollectionsList project={project} />
        </section>
      </Authorize>
    );
  }
}
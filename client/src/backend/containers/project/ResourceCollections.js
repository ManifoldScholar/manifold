import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Resource from "./resource";
import lh from "helpers/linkHandler";

import Authorize from "hoc/Authorize";

export default class ProjectResourcesCollectionsContainer extends PureComponent {
  static displayName = "Project.ResourceCollectionsContainer";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;
    if (!project) return null;

    return (
      <Authorize
        entity={project}
        ability="manageResourceCollections"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section>
          <Resource.ResourceCollectionsList project={project} />
        </section>
      </Authorize>
    );
  }
}

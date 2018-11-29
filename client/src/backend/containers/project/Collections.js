import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Resource from "./Resource";
import { HigherOrder } from "containers/global";
import lh from "helpers/linkHandler";

export default class ProjectCollectionsContainer extends PureComponent {
  static displayName = "Project.CollectionsContainer";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;
    if (!project) return null;

    return (
      <HigherOrder.Authorize
        entity={project}
        ability="manageCollections"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section>
          <Resource.CollectionsList project={project} />
        </section>
      </HigherOrder.Authorize>
    );
  }
}

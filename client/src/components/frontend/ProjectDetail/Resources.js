import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ResourceList, ResourceCollectionList } from "components/frontend";

export default class ProjectDetailResources extends PureComponent {
  static displayName = "ProjectDetail.Resources";

  static propTypes = {
    project: PropTypes.object.isRequired
  };

  renderCollections = () => {
    const project = this.props.project;
    const { attributes } = project;

    return (
      <div className="entities">
        <ResourceCollectionList.Grid project={project} />
        <ResourceList.Totals
          count={attributes.resourcesCount}
          project={project}
        />
      </div>
    );
  };

  renderResources = () => {
    const project = this.props.project;
    const { attributes, relationships } = project;

    return (
      <div className="entities">
        <ResourceList.Thumbnails
          resources={relationships.uncollectedResources}
          project={project}
        />
        <ResourceList.Totals
          count={attributes.uncollectedResourcesCount}
          project={project}
        />
      </div>
    );
  };

  render() {
    const project = this.props.project;
    const { collectionsCount, resourcesCount } = project.attributes;

    return collectionsCount > 0
      ? this.renderCollections()
      : this.renderResources();
  }
}

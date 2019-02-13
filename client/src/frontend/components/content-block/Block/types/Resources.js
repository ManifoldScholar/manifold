import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ResourceCollectionList from "frontend/components/resource-collection-list";
import ResourceList from "frontend/components/resource-list";

export default class ProjectContentBlockResourcesBlock extends PureComponent {
  static displayName = "Project.Content.Block.Resources";

  static propTypes = {
    project: PropTypes.object.isRequired,
    block: PropTypes.object.isRequired
  };

  static get title() {
    return "Resources";
  }

  static get icon() {
    return "cubeShine";
  }

  get block() {
    return this.props.block;
  }

  get project() {
    return this.props.project;
  }

  get hasVisibleCollections() {
    return this.countVisibleCollections > 0;
  }

  get countVisibleCollections() {
    return this.visibleCollections.length;
  }

  get projectCollections() {
    return this.project.relationships.resourceCollections;
  }

  get countProjectCollections() {
    return this.projectCollections.length;
  }

  get featuredCollections() {
    return this.block.relationships.featuredCollections;
  }

  get visibleCollections() {
    if (this.block.attributes.showAllCollections)
      return this.projectCollections;
    return this.featuredCollections;
  }

  get hasVisibleResources() {
    return this.visibleResources.length > 0;
  }

  get visibleResources() {
    return this.project.relationships.resources;
  }

  get resourcesTotal() {
    return this.project.attributes.resourcesCount;
  }

  get isSparse() {
    return (
      (!this.hasVisibleCollections && !this.hasVisibleResources) ||
      (this.hasVisibleCollections && this.visibleCollections.length < 2) ||
      (this.hasVisibleResources && this.visibleResources.length < 5)
    );
  }

  render() {
    return (
      <div className="entity-section-wrapper__body">
        {this.hasVisibleCollections && (
          <React.Fragment>
            <ResourceCollectionList.Grid
              project={this.project}
              resourceCollections={this.visibleCollections}
            />
            <ResourceCollectionList.Totals
              alignLeft={this.isSparse}
              project={this.project}
              count={this.countProjectCollections}
            />
          </React.Fragment>
        )}
        <ResourceList.Thumbnails
          project={this.project}
          resources={this.visibleResources}
        />
        {!this.hasVisibleCollections && (
          <ResourceCollectionList.Totals
            alignLeft={this.isSparse}
            tight
            project={this.project}
            count={this.countProjectCollections}
          />
        )}
        <ResourceList.Totals
          alignLeft={this.isSparse}
          project={this.project}
          count={this.resourcesTotal}
        />
      </div>
    );
  }
}

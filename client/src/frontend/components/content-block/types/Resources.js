import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import EntityListTotal from "global/components/entity/ListTotal";
import ResourceCollectionList from "frontend/components/resource-collection-list";
import ResourceList from "frontend/components/resource-list";
import lh from "helpers/linkHandler";

export default class ProjectContentBlockResourcesBlock extends PureComponent {
  static displayName = "Project.Content.Block.Resources";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    block: PropTypes.object.isRequired
  };

  static get title() {
    return "Resources";
  }

  static get icon() {
    return "resources64";
  }

  get block() {
    return this.props.block;
  }

  get entity() {
    return this.props.entity;
  }

  get hasVisibleCollections() {
    return this.countVisibleCollections > 0;
  }

  get countVisibleCollections() {
    return this.visibleCollections.length;
  }

  get resourceCollections() {
    return this.entity.relationships.resourceCollections;
  }

  get countProjectCollections() {
    return this.resourceCollections.length;
  }

  get featuredCollections() {
    return this.block.relationships.featuredCollections;
  }

  get visibleCollections() {
    if (this.block.attributes.showAllCollections)
      return this.resourceCollections;
    return this.featuredCollections;
  }

  get hasVisibleResources() {
    return this.visibleResources.length > 0;
  }

  get visibleResources() {
    return this.entity.relationships.resources;
  }

  get resourcesTotal() {
    return this.entity.attributes.resourcesCount;
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
      <>
        {this.hasVisibleCollections && (
          <>
            <h3 className="screen-reader-text">Resource Collections</h3>
            <ResourceCollectionList.Grid
              resourceCollections={this.visibleCollections}
            />
            <EntityListTotal
              linkTo={lh.link(
                "frontendProjectResourceCollections",
                this.entity.attributes.slug
              )}
              entityName="Collection"
              count={this.countProjectCollections}
              alignLeft={this.isSparse}
            />
          </>
        )}
        <h3 className="screen-reader-text">Single Resources</h3>
        <ResourceList.Thumbnails resources={this.visibleResources} />
        <EntityListTotal
          linkTo={lh.link(
            "frontendProjectResources",
            this.entity.attributes.slug
          )}
          entityName="Resource"
          count={this.resourcesTotal}
          alignLeft={this.isSparse}
        />
      </>
    );
  }
}

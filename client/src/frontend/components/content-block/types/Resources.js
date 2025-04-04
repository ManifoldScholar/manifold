import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import EntityListTotal from "global/components/entity/ListTotal";
import ResourceCollectionList from "frontend/components/resource-collection-list";
import ResourceList from "frontend/components/resource-list";
import lh from "helpers/linkHandler";

class ProjectContentBlockResourcesBlock extends PureComponent {
  static displayName = "Project.Content.Block.Resources";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    block: PropTypes.object.isRequired,
    t: PropTypes.func
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
    if (!this.block.attributes.showResources) return [];

    if (this.block.relationships.featuredResources?.length)
      return this.block.relationships.featuredResources;

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
            <h3 className="screen-reader-text">
              {this.props.t("glossary.resource_collection_title_case_other")}
            </h3>
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
        {this.hasVisibleResources && (
          <>
            <h3 className="screen-reader-text">
              {this.props.t("layout.resources_block_resources_subtitle")}
            </h3>
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
        )}
      </>
    );
  }
}

export default withTranslation()(ProjectContentBlockResourcesBlock);

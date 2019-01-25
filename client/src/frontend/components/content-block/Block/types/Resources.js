import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Wrapper from "../parts/Wrapper";
import Heading from "../parts/Heading";
import ResourceCollectionList from "frontend/components/resource-collection-list";
import ResourceList from "frontend/components/resource-list";

export default class ProjectContentBlockResourcesBlock extends PureComponent {
  static displayName = "Project.Content.Block.Resources";

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    project: PropTypes.object.isRequired,
    block: PropTypes.object.isRequired
  };

  static defaultProps = {
    title: "Resources",
    icon: "cubeShine"
  };

  get block() {
    return this.props.block;
  }

  get blockTitle() {
    if (!this.block) return null;
    return this.block.attributes.title || this.props.title;
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
    return this.project.relationships.collections;
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
    const baseClass = "entity-section-wrapper";

    return (
      <Wrapper>
        <Heading title={this.blockTitle} icon={this.props.icon} />
        <div className={`${baseClass}__body`}>
          {this.hasVisibleCollections && (
            <React.Fragment>
              <ResourceCollectionList.Grid
                project={this.project}
                collections={this.visibleCollections}
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
      </Wrapper>
    );
  }
}

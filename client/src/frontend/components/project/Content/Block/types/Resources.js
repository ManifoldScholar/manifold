import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Wrapper from "../parts/Wrapper";
import Heading from "../parts/Heading";
import ResourceCollectionList from "frontend/components/resource-collection-list";
import ResourceList from "frontend/components/resource-list";
import lh from "helpers/linkHandler";

export default class ProjectContentBlockResourcesBlock extends PureComponent {
  static displayName = "Project.Content.Block.Resources";

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    project: PropTypes.object.isRequired
  };

  static defaultProps = {
    title: "Resources",
    icon: "cubeShine"
  };

  get block() {
    return this.props.block;
  }

  get project() {
    return this.props.project;
  }

  get showCollections() {
    return this.block.attributes.showCollections;
  }

  get featuredCollections() {
    return this.block.relationships.featuredCollections;
  }

  renderCollectionList() {
    return (
      <React.Fragment>
        <ResourceCollectionList.Grid
          project={this.project}
          collections={this.featuredCollections}
        />
        <ResourceCollectionList.Totals
          project={this.project}
          count={this.featuredCollections.length}
        />
      </React.Fragment>
    );
  }

  render() {
    const baseClass = "entity-section-wrapper";
    const { relationships, attributes } = this.project;

    return (
      <Wrapper>
        <Heading title={this.props.title} icon={this.props.icon} />
        <div className={`${baseClass}__body`}>
          {this.showCollections && this.renderCollectionList()}
          <ResourceList.Thumbnails
            project={this.project}
            resources={relationships.uncollectedResources}
          />
          <ResourceList.Totals
            project={this.project}
            count={attributes.uncollectedResourcesCount}
          />
        </div>
      </Wrapper>
    );
  }
}

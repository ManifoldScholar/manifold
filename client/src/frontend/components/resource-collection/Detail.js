import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Title from "./Title";
import ResourceList from "frontend/components/resource-list";
import Utility from "frontend/components/utility";

export default class ResourceCollectionDetail extends PureComponent {
  static displayName = "ResourceCollection.Detail";

  static propTypes = {
    resourceCollection: PropTypes.object,
    project: PropTypes.object,
    resourceCollectionUrl: PropTypes.string.isRequired,
    slideshowResources: PropTypes.array,
    slideshowPagination: PropTypes.object,
    collectionResources: PropTypes.array,
    resourceCollectionPagination: PropTypes.object,
    resourceCollectionPaginationHandler: PropTypes.func,
    dispatch: PropTypes.func,
    filterChange: PropTypes.func.isRequired,
    initialFilterState: PropTypes.object
  };

  renderDescription(description) {
    if (!description) return null;
    return (
      <div
        className="collection-description"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }

  render() {
    const project = this.props.project;
    const resourceCollection = this.props.resourceCollection;
    if (!project || !resourceCollection) return null;

    const attr = resourceCollection.attributes;
    const count = attr.collectionResourcesCount;
    return (
      <section className="collection-detail">
        <div className="container flush-bottom">
          <Title resourceCollection={resourceCollection} showCreatedAt />
          {this.renderDescription(attr.descriptionFormatted)}
          <div className="utility">
            <Utility.ShareBar url={this.props.resourceCollectionUrl} />
          </div>
        </div>
        <ResourceList.Slideshow
          resourceCollection={this.props.resourceCollection}
          collectionResources={this.props.slideshowResources}
          count={project.attributes.resourcesCount}
          pagination={this.props.slideshowPagination}
          dispatch={this.props.dispatch}
        />
        <div className="container flush-top">
          <ResourceList.Totals
            belongsTo="collection"
            count={count}
            project={project}
          />
          <ResourceList.Filters
            kinds={resourceCollection.attributes.resourceKinds}
            tags={resourceCollection.attributes.resourceTags}
            initialFilterState={this.props.initialFilterState}
            filterChangeHandler={this.props.filterChange}
          />
          <ResourceList.Cards
            resourceCollection={this.props.resourceCollection}
            project={this.props.project}
            resources={this.props.collectionResources}
            pagination={this.props.resourceCollectionPagination}
            paginationClickHandler={
              this.props.resourceCollectionPaginationHandler
            }
          />
        </div>
      </section>
    );
  }
}

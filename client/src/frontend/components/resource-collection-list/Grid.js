import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourceCollection from "frontend/components/resource-collection";
import lh from "helpers/linkHandler";

export default class ResourceCollectionGrid extends Component {
  static displayName = "ResourceCollection.Grid";

  static propTypes = {
    project: PropTypes.object.isRequired,
    resourceCollections: PropTypes.array.isRequired,
    itemHeadingLevel: PropTypes.oneOf([2, 3, 4, 5, 6])
  };

  urlCreator = collection => {
    return lh.link(
      "frontendProjectResourceCollection",
      this.props.project.attributes.slug,
      collection.attributes.slug
    );
  };

  render() {
    const { resourceCollections, itemHeadingLevel } = this.props;
    if (!resourceCollections) return null;

    return (
      <div className="resource-collections-list">
        <ul>
          {resourceCollections.map(collection => {
            return (
              <ResourceCollection.Cover
                key={collection.id}
                urlCreator={this.urlCreator}
                resourceCollection={collection}
                itemHeadingLevel={itemHeadingLevel}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourceCollection from "frontend/components/resource-collection";
import lh from "helpers/linkHandler";

export default class ResourceCollectionGrid extends Component {
  static displayName = "ResourceCollection.Grid";

  static propTypes = {
    project: PropTypes.object.isRequired,
    resourceCollections: PropTypes.array.isRequired
  };

  urlCreator = collection => {
    return lh.link(
      "frontendProjectResourceCollection",
      this.props.project.attributes.slug,
      collection.attributes.slug
    );
  };

  render() {
    const resourceCollections = this.props.resourceCollections;
    if (!resourceCollections) return null;

    return (
      <nav className="resource-collections-list">
        <ul>
          {resourceCollections.map(collection => {
            return (
              <ResourceCollection.Cover
                key={collection.id}
                urlCreator={this.urlCreator}
                resourceCollection={collection}
              />
            );
          })}
        </ul>
      </nav>
    );
  }
}

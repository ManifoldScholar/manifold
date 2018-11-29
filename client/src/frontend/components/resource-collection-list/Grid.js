import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourceCollection from "frontend/components/resource-collection";
import lh from "helpers/linkHandler";

export default class ResourceCollectionGrid extends Component {
  static displayName = "ResourceCollection.Grid";

  static propTypes = {
    project: PropTypes.object.isRequired
  };

  urlCreator = collection => {
    return lh.link(
      "frontendResourceCollection",
      this.props.project.attributes.slug,
      collection.attributes.slug
    );
  };

  render() {
    const { collections } = this.props.project.relationships;
    if (!collections) return null;

    return (
      <nav className="resource-collections-list">
        <ul>
          {collections.map(collection => {
            return (
              <ResourceCollection.Cover
                key={collection.id}
                urlCreator={this.urlCreator}
                collection={collection}
              />
            );
          })}
        </ul>
      </nav>
    );
  }
}

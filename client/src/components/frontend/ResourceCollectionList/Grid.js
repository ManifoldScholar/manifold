import React, { Component } from "react";
import PropTypes from "prop-types";
import { ResourceCollection } from "components/frontend";
import lh from "helpers/linkHandler";

export default class ResourceCollectionGrid extends Component {
  static displayName = "ResourceCollection.Grid";

  static propTypes = {
    project: PropTypes.object.isRequired
  };

  urlCreator = collection => {
    return lh.link(
      "frontendProjectCollection",
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

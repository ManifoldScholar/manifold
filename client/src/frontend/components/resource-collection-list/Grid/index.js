import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourceCollection from "frontend/components/resource-collection";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

export default class ResourceCollectionGrid extends Component {
  static displayName = "ResourceCollection.Grid";

  static propTypes = {
    resourceCollections: PropTypes.array.isRequired,
    itemHeadingLevel: PropTypes.oneOf([2, 3, 4, 5, 6])
  };

  urlCreator = collection => {
    return lh.link(
      "frontendProjectResourceCollection",
      collection.attributes.projectSlug,
      collection.attributes.slug
    );
  };

  render() {
    const { resourceCollections, itemHeadingLevel } = this.props;
    if (!resourceCollections) return null;

    return (
      <Styled.Grid>
        {resourceCollections.map(collection => {
          return (
            <li key={collection.id}>
              <ResourceCollection.Cover
                urlCreator={this.urlCreator}
                resourceCollection={collection}
                itemHeadingLevel={itemHeadingLevel}
              />
            </li>
          );
        })}
      </Styled.Grid>
    );
  }
}

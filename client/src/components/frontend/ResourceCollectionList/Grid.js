import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResourceCollection } from 'components/frontend';

export default class ResourceCollectionGrid extends Component {

  static displayName = "ResourceCollection.Grid";

  static propTypes = {
    projectId: PropTypes.string,
    resourceCollections: PropTypes.array
  };

  render() {
    if (!this.props.resourceCollections) return null;
    return (
      <nav className="resource-collections-list">
        <ul>
          {this.props.resourceCollections.map((collection) => {
            return (
              <ResourceCollection.Thumbnail key={collection.id}
                projectId={this.props.projectId}
                resourceCollection={collection}
              />
            );
          })}
        </ul>
      </nav>
    );
  }
}

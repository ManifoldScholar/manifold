import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { ResourceCollection } from 'components/frontend';

export default class ResourceCollectionGrid extends Component {

  static displayName = "ResourceCollection.Grid";

  static propTypes = {
    projectId: PropTypes.string,
    resourceCollections: PropTypes.array
  };

  render() {
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

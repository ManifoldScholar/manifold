import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { ResourceCollection } from 'components/frontend';

export default class ResourceCollectionGrid extends Component {

  static displayName = "ResourceCollection.Grid";

  static propTypes = {
    projectId: PropTypes.string
  };

  render() {
    const stubCollections = [
      {
        id: 1,
        image: '/static/placeholder/background-waterfall.jpg',
        title: 'Recorded conversations with author; Pre-translated'
      },
      {
        id: 2,
        title: 'Slideshow: photos of original manuscript with handwritten notes'
      },
      {
        id: 3,
        image: '/static/placeholder/background-coniferous.jpg',
        title: 'Untitled'
      }
    ];

    const collectionsBackground = '/static/images/resource-collection.jpg';

    return (
      <nav className="resource-collections-list">
        <ul>
          {stubCollections.map((collection) => {
            const bgImage = collection.image ? collection.image : collectionsBackground;
            return (
              <ResourceCollection.Thumbnail key={collection.id}
                projectId={this.props.projectId}
                collection={collection}
              />
            );
          })}
        </ul>
      </nav>
    );
  }
}

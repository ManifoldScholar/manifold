import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ResourceCollections extends Component {

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
              <li key={collection.id}>
                <Link
                  to={`/browse/project/${this.props.projectId}/resources`}
                  style={ { backgroundImage: 'url(' + bgImage + ')' } }
                >
                  <div className="title-overlay">
                    <h4 className="collection-title">
                      {collection.title}
                    </h4>
                    <div className="icon">
                      <i className="manicon manicon-file-box"></i>
                      {'Collection'}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

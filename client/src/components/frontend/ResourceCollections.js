import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ResourceCollections extends Component {

  // static propTypes = {
  //   text: PropTypes.object
  // };

  render() {
    const stubCollections = [
      {
        id: Math.random() * 100,
        image: '/placeholder/background-waterfall.jpg',
        title: 'Recorded conversations with author; Pre-translated'
      },
      {
        id: Math.random() * 100,
        title: 'Slideshow: photos of original manuscript with handwritten notes'
      },
      {
        id: Math.random() * 100,
        image: '/placeholder/background-waterfall.jpg',
        title: 'Untitled'
      }
    ];

    const collectionsBackground = '/images/resource-collection.jpg';

    return (
      <nav className="resource-collections-list">
        <ul>
          {stubCollections.map((collection) => {
            const bgImage = collection.image ? collection.image : collectionsBackground;
            return (
              <li key={collection.id}>
                <a href="#" style={ { backgroundImage: 'url(' + bgImage + ')' } }>
                  <div className="title-overlay">
                    <h4 className="collection-title">
                      {collection.title}
                    </h4>
                    <div className="icon">
                      <i className="manicon manicon-file-box"></i>
                      {'Collection'}
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

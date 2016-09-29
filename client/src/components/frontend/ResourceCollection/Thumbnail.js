import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ResourceCollectionThumbnail extends Component {

  static displayName = "ResourceCollection.Thumbnail";

  static propTypes = {
    collection: PropTypes.object,
    projectId: PropTypes.string
  };

  render() {
    const collectionsBackground = '/static/images/resource-collection.jpg';
    const collection = this.props.collection;
    const bgImage = collection.image ? collection.image : collectionsBackground;
    return (
      <li>
        <Link
          to={`/browse/project/${this.props.projectId}/collection/${collection.id}`}
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
  }
}

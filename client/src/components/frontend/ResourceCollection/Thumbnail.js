import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ResourceCollectionThumbnail extends Component {

  static displayName = "ResourceCollection.Thumbnail";

  static propTypes = {
    resourceCollection: PropTypes.object,
    projectId: PropTypes.string
  };

  render() {
    const collectionsBackground = '/static/images/resource-collection.jpg';
    const collection = this.props.resourceCollection;
    const attr = collection.attributes;
    const bgImage = attr.thumbnailStyles.medium ?
      attr.thumbnailStyles.medium : collectionsBackground;
    return (
      <li>
        <Link
          to={`/browse/project/${this.props.projectId}/collection/${collection.id}`}
          style={ { backgroundImage: 'url(' + bgImage + ')' } }
        >
          <div className="title-overlay">
            <h4 className="collection-title">
              {attr.title}
            </h4>
            <div className="icon">
              <i className="manicon manicon-file-box"></i>
              <span>{'Collection'}</span>
            </div>
          </div>
        </Link>
      </li>
    );
  }
}

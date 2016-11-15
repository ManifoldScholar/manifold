import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class ResourceThumbnail extends Component {

  static displayName = "Resource.Thumbnail";

  static propTypes = {
    resource: PropTypes.object,
    isList: PropTypes.bool
  };

  static defaultProps = {
    isList: true
  };

  getResourceKind(kind) {
    return kind.toLowerCase().charAt(0).toUpperCase() + kind.slice(1);
  }

  render() {

    const resource = this.props.resource;

    const linkClass = classNames({
      'bg-image': resource.attributes.attachmentThumbnailUrl
    });

    let linkStyle = {};
    if (resource.attributes.attachmentUrl) {
      linkStyle = {
        backgroundImage: `url('${resource.attributes.attachmentThumbnailUrl}')`
      };
    }

    const ContainerTag = this.props.isList ? 'li' : 'div';
    return (
      <li>
        <Link
          to={`/browse/resource/${resource.id}`}
          className={linkClass} style={linkStyle}
        >
          <figure className="resource-type">
            <figcaption>
              {this.getResourceKind(resource.attributes.kind)}
            </figcaption>
            <i className={`manicon manicon-resource-${resource.attributes.kind}`}></i>
          </figure>
          <h4 className="resource-title">
            {resource.attributes.title}
          </h4>
        </Link>
      </li>
    );

  }
}

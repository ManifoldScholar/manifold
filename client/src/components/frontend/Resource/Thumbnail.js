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

  getResourceType(type) {
    return type.toLowerCase().charAt(0).toUpperCase() + type.slice(1);
  }

  render() {

    const resource = this.props.resource;

    const linkClass = classNames({
      'bg-image': resource.attributes.image
    });

    let linkStyle = {};
    if (resource.attributes.image) {
      linkStyle = {
        backgroundImage: `url('${resource.attributes.image}')`
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
              {this.getResourceType(resource.attributes.type)}
            </figcaption>
            <i className={`manicon manicon-resource-${resource.attributes.type}`}></i>
          </figure>
          <h4 className="resource-title">
            {resource.attributes.title}
          </h4>
        </Link>
      </li>
    );

  }
}

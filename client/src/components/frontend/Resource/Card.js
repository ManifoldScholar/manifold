import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class ResourceCard extends Component {

  static displayName = "Resource.Card";

  static propTypes = {
    resource: PropTypes.object,
    projectId: PropTypes.string
  };

  constructor() {
    super();
  }

  getResourceType(type) {
    let formattedType = type.toLowerCase().charAt(0).toUpperCase() + type.slice(1);
    if (type.toLowerCase() === 'pdf') {
      formattedType = 'PDF';
    }

    return formattedType;
  }

  getPreviewText(type) {
    let text = false;

    switch (type.toLowerCase()) {
      case 'image':
      case 'interactive':
        text = (
            <span>
            {'Preview'}
              <i className="manicon manicon-eye-outline"></i>
          </span>
        );
        break;
      case 'link':
        text = (
          <span>
            {'Visit'}
            <i className="manicon manicon-arrow-right"></i>
          </span>
        );
        break;
      case 'video':
        text = (
          <span>
            {'Play'}
            <i className="manicon manicon-triangle-right"></i>
          </span>
        );
        break;
      default:
        text = (
          <span>
            {'Download'}
            <i className="manicon manicon-arrow-down"></i>
          </span>
        );
    }

    return text;
  }

  renderTags(resource) {
    if (!resource.tags) {
      return false;
    }

    function commaSeparate(index) {
      if (index >= resource.tags.length - 1) return false;
      return (
        <span>
          {', '}
        </span>
      );
    }

    return (
      <nav className="resource-tags">
        <ul>
          {resource.tags.map((tag, index) => {
            return (
              <li key={index}>
                <Link to="#">{tag}</Link>{commaSeparate(index)}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  render() {
    const resource = this.props.resource;

    const linkClass = classNames({
      thumbnail: true,
      'bg-image': resource.image
    });

    let linkStyle = {};
    if (resource.image) {
      linkStyle = {
        backgroundImage: `url('${resource.image}')`
      };
    }

    return (
      <li className="resource-listing">
        <Link
          to={`/browse/project/${this.props.projectId}/resources/${resource.id}`}
          className={linkClass} style={linkStyle}
        >
          <figure className="resource-type">
            <figcaption>
              {this.getResourceType(resource.attributes.type)}
            </figcaption>
            <i className={`manicon manicon-resource-${resource.attributes.type}`}></i>
          </figure>
          <div className="preview-text">
            {this.getPreviewText(resource.attributes.type)}
          </div>
        </Link>
        <div className="resource-info">
          <div>
            <Link
              to={`/browse/project/${this.props.projectId}/resources/${resource.id}`}
              className="resource-title"
            >
              <h4>
                {resource.title}
              </h4>
            </Link>
            <span className="resource-date">
              {'Uploaded September, 2016'}
            </span>
            <Link
              to={`/browse/project/${this.props.projectId}/resources/${resource.id}`}
              className="arrow-link"
            >
              <i className="manicon manicon-arrow-right"></i>
            </Link>
          </div>

          {this.renderTags(resource)}
        </div>
      </li>
    );
  }
}

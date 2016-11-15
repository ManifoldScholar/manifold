import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import moment from 'moment';

export default class ResourceCard extends Component {

  static displayName = "Resource.Card";

  static propTypes = {
    resource: PropTypes.object,
    projectId: PropTypes.string
  };

  constructor() {
    super();
    this.handlePreviewClick = this.handlePreviewClick.bind(this);
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

  handlePreviewClick(event) {
    event.preventDefault();
    const attr = this.props.resource.attributes;
    switch (attr.kind.toLowerCase()) {
      case "link":
        window.open(attr.externalUrl);
        break;
      default:
        window.open(attr.attachmentUrl);
        break;
    }
  }

  renderTags(resource) {
    if (!resource.attributes.tags) {
      return false;
    }

    function commaSeparate(index) {
      if (index >= resource.attributes.tags.length - 1) return false;
      return (
        <span>
          {', '}
        </span>
      );
    }

    return (
      <nav className="resource-tags">
        <ul>
          {resource.attributes.tags.map((tag, index) => {
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
    const attr = resource.attributes;

    const linkClass = classNames({
      thumbnail: true,
      'bg-image': attr.attachmentThumbnailUrl
    });

    let linkStyle = {};
    if (attr.attachmentThumbnailUrl) {
      linkStyle = {
        backgroundImage: `url('${attr.attachmentThumbnailUrl}')`
      };
    }

    return (
      <li className="resource-listing">
        <Link
          to={`/browse/resource/${resource.id}`}
          className={linkClass} style={linkStyle}
        >
          <figure className="resource-type">
            <figcaption>
              {this.getResourceType(attr.kind)}
            </figcaption>
            <i className={`manicon manicon-resource-${attr.kind}`}></i>
          </figure>
          <div onClick={this.handlePreviewClick} className="preview-text">
            {this.getPreviewText(attr.kind)}
          </div>
        </Link>
        <div className="resource-info">
          <div>
            <Link
              to={`/browse/resource/${resource.id}`}
              className="resource-title"
            >
              <h4>
                {attr.title}
              </h4>
            </Link>
            <span className="resource-date">
              {
                `Uploaded
                ${moment().month(attr.createdMonth - 1).format("MMMM")},
                ${attr.createdYear}`
              }
            </span>
            <Link
              to={`/browse/resource/${resource.id}`}
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

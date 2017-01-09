import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

export default class ResourceCard extends Component {

  static displayName = "Resource.Card";

  static propTypes = {
    resource: PropTypes.object,
    context: PropTypes.object
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

  detailUrl() {
    const context = this.props.context;
    if (context.type === "collections") {
      const crid = this.props.resource.id;
      const pid = context.relationships.project.id;
      const cid = context.id;
      return `/browse/project/${pid}/collection/${cid}/collection_resource/${crid}`;
    }
    if (context.type === "projects") {
      const resource = this.resource();
      const pid = context.id;
      const rid = resource.id;
      return `/browse/project/${pid}/resource/${rid}`;
    }
  }

  handlePreviewClick(event) {
    event.preventDefault();
    const attr = this.resource().attributes;
    switch (attr.kind.toLowerCase()) {
      case "link":
        window.open(attr.externalUrl);
        break;
      default:
        window.open(attr.attachmentUrl);
        break;
    }
  }

  resource() {
    if (this.props.resource.type === "collectionResources") {
      return this.props.resource.relationships.resource;
    }
    return this.props.resource;
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
    const resource = this.resource();
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

    const tmp = `${attr.createdMonth}/1/${attr.createdYear}`;
    const uploadedDate = format(parse(tmp), 'MMMM, YYYY');

    return (
      <li className="resource-card">
        <Link
          to={this.detailUrl()}
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
              to={this.detailUrl()}
              className="resource-title"
            >
              <h4>
                {attr.title}
              </h4>
            </Link>
            <span className="resource-date">
              {uploadedDate}
            </span>
            <Link
              to={this.detailUrl()}
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

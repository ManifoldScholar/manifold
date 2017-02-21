import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import FormattedDate from 'components/global/FormattedDate';
import { Resource } from 'components/frontend';
import { find } from 'lodash';

export default class ResourceCard extends Component {

  static displayName = "Resource.Card";

  static propTypes = {
    resource: PropTypes.object,
    context: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      infoHover: false
    };
    this.handlePreviewClick = this.handlePreviewClick.bind(this);
    this.handleInfoMouseOver = this.handleInfoMouseOver.bind(this);
    this.handleInfoMouseOut = this.handleInfoMouseOut.bind(this);
    this.handleInfoClick = this.handleInfoClick.bind(this);
    this.handleTagHover = this.handleTagHover.bind(this);
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

  getCollectionResourceId(resource) {
    if (!resource) return null;
    const collectionResources = resource.relationships.collectionResources;
    const out = find(collectionResources, (obj) => {
      return obj.attributes.collectionId === this.props.context.id;
    });
    return out.id;
  }

  detailUrl() {
    const context = this.props.context;
    if (context.type === "collections") {
      const pid = context.relationships.project.id;
      const cid = context.id;
      const crid = this.getCollectionResourceId(this.props.resource);
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

  handleInfoMouseOver() {
    this.setState({
      infoHover: true
    });
  }

  handleInfoMouseOut() {
    this.setState({
      infoHover: false
    });
  }

  handleInfoClick() {
    browserHistory.push(this.detailUrl());
  }

  handleTagHover(event) {
    event.stopPropagation();
    this.setState({
      infoHover: false
    });
  }

  handleTagClick(event) {
    // Placeholder method, ultimately this will link
    // to the tag detail

    // Event handler, has access to react synthetic click event
    // Will need to be bound to the component in the constructor to use any component
    // state or props
    event.stopPropagation();
    browserHistory.push('/sample');
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
                <div
                  key={index}
                  className="tag-link"
                  onMouseOver={this.handleTagHover}
                  onClick={this.handleTagClick}
                >
                  {tag}{commaSeparate(index)}
                </div>
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

    const infoClass = classNames({
      'resource-info': true,
      hover: this.state.infoHover
    });


    return (
      <li className="resource-card">
        <Link
          to={this.detailUrl()}
          className="resource-link"
        >
          <Resource.Thumbnail
            resource={resource}
          />
          <div onClick={this.handlePreviewClick} className="preview-text">
            {this.getPreviewText(attr.kind)}
          </div>
        </Link>
        <section
          className={infoClass}
          onMouseOver={this.handleInfoMouseOver}
          onMouseOut={this.handleInfoMouseOut}
          onClick={this.handleInfoClick}
        >
          <div>
            <header
              className="resource-title"
            >
              <h4>
                {attr.title}
              </h4>
            </header>
            <span className="resource-date">
              <FormattedDate
                format="MMMM, YYYY"
                date={attr.createdAt}
              />
            </span>
            <div
              to={this.detailUrl()}
              className="arrow-link"
            >
              <i className="manicon manicon-arrow-right"></i>
            </div>
          </div>

          {this.renderTags(resource)}
        </section>
      </li>
    );
  }
}

import React, { Component, PropTypes } from 'react';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import FormattedDate from 'components/global/FormattedDate';
import { Resource } from 'components/frontend';
import { find } from 'lodash';
import lh from 'helpers/linkHandler';

class ResourceCard extends Component {

  static displayName = "Resource.Card";

  static propTypes = {
    history: PropTypes.object.isRequired,
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

  getPreviewText(attr) {
    const type = attr.kind;
    const text = (attr.downloadable ?
      this.renderDownloadablePreview(type)
      : <span>
          {'View'}
          <i className="manicon manicon-arrow-right"></i>
        </span>
    );
    return text;
  }

  getCollectionResourceId(resource) {
    if (!resource) return null;
    const collectionResources = resource.relationships.collectionResources;
    const out = find(collectionResources, (obj) => {
      return obj.attributes.collectionId === this.props.context.id;
    });
    if (!out) return null;
    return out.id;
  }

  detailUrl() {
    const context = this.props.context;
    if (context.type === "collections") {
      const pid = context.attributes.projectId;
      const cid = context.id;
      const crid = this.getCollectionResourceId(this.props.resource);
      return lh.link("frontendProjectCollectionCollectionResource", pid, cid, crid);
    }
    if (context.type === "projects") {
      const resource = this.resource();
      const pid = context.id;
      const rid = resource.id;
      return lh.link("frontendProjectResource", pid, rid);
    }
  }

  handlePreviewClick(event) {
    event.preventDefault();
    const attr = this.resource().attributes;
    let action = null;
    switch (attr.kind.toLowerCase()) {
      case "link":
        action = window.open(attr.externalUrl);
        break;
      default:
        action = attr.downloadable ?
          window.open(attr.attachmentStyles.original)
          : this.handleInfoClick();
        break;
    }
    return action;
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
    this.props.history.push(this.detailUrl());
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
  }

  resource() {
    if (this.props.resource.type === "collectionResources") {
      return this.props.resource.relationships.resource;
    }
    return this.props.resource;
  }

  renderDownloadablePreview(type) {
    if (!type) return null;
    let out = null;
    switch (type.toLowerCase()) {
      case 'image':
      case 'interactive':
        out = (
          <span>
            {'Preview'}
            <i className="manicon manicon-eye-outline"></i>
          </span>
        );
        break;
      case 'link':
        out = (
          <span>
            {'Visit'}
            <i className="manicon manicon-arrow-right"></i>
          </span>
        );
        break;
      case 'video':
        out = (
          <span>
            {'Play'}
            <i className="manicon manicon-triangle-right"></i>
          </span>
        );
        break;
      default:
        out = (
          <span>
            {'Download'}
            <i className="manicon manicon-arrow-down"></i>
          </span>
        );
    }
    return out;
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
    if (!resource) return null;
    const attr = resource.attributes;

    const linkClass = classNames({
      thumbnail: true,
      'bg-image': attr.attachmentStyles.smallPortrait
    });

    const infoClass = classNames({
      'resource-info': true,
      hover: this.state.infoHover
    });


    return (
      <li className="resource-card">
        <div
          className="resource-link"
          onClick={this.handlePreviewClick}
        >
          <Resource.Thumbnail
            resource={resource}
          />
          <div className="preview-text">
            {this.getPreviewText(attr)}
          </div>
        </div>
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
              <h4 dangerouslySetInnerHTML={{ __html: attr.titleFormatted }} />
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

export default withRouter(ResourceCard);

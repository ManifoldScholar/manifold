import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import FormattedDate from "components/global/FormattedDate";
import { Resource } from "components/frontend";
import { find } from "lodash";
import lh from "helpers/linkHandler";

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
    this.handleInfoMouseOver = this.handleInfoMouseOver.bind(this);
    this.handleInfoMouseOut = this.handleInfoMouseOut.bind(this);
    this.handleInfoClick = this.handleInfoClick.bind(this);
    this.handleTagHover = this.handleTagHover.bind(this);
    this.handlePreviewClick = this.handlePreviewClick.bind(this);
  }

  getResourceType(type) {
    let formattedType =
      type.toLowerCase().charAt(0).toUpperCase() + type.slice(1);
    if (type.toLowerCase() === "pdf") {
      formattedType = "PDF";
    }
    return formattedType;
  }

  getPreviewText(attr) {
    const type = attr.kind;
    const text = attr.downloadable
      ? this.renderDownloadablePreview(type)
      : <span>
          {"View"}
          <i className="manicon manicon-arrow-right" />
        </span>;
    return text;
  }

  getCollectionResourceId(resource) {
    if (!resource) return null;
    const collectionResources = resource.relationships.collectionResources;
    const out = find(collectionResources, obj => {
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
      return lh.link(
        "frontendProjectCollectionCollectionResource",
        pid,
        cid,
        crid
      );
    }
    if (context.type === "projects") {
      const resource = this.resource();
      const pid = context.id;
      const rid = resource.id;
      return lh.link("frontendProjectResource", pid, rid);
    }
  }

  previewable(resource) {
    return Resource.Preview.canPreview(resource);
  }

  linkable(resource) {
    return resource.attributes.kind.toLowerCase() === "link";
  }

  downloadable(resource) {
    return resource.attributes.downloadable || false;
  }

  doDownload(resource) {
    window.open(resource.attributes.attachmentStyles.original);
  }

  openLink(resource) {
    window.open(resource.attributes.externalUrl);
  }

  handlePreviewClick(event) {
    event.preventDefault();
    const resource = this.resource();
    if (this.previewable(resource)) return;
    if (this.downloadable(resource)) return this.doDownload(resource);
    if (this.linkable(resource)) return this.openLink(resource);
    // Open the resource detail view if all else fails.
    return this.handleInfoClick();
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
      case "image":
      case "interactive":
        out = (
          <span>
            {"Preview"}
            <i className="manicon manicon-eye-outline" />
          </span>
        );
        break;
      case "link":
        out = (
          <span>
            {"Visit"}
            <i className="manicon manicon-arrow-right" />
          </span>
        );
        break;
      case "video":
        out = (
          <span>
            {"Play"}
            <i className="manicon manicon-triangle-right" />
          </span>
        );
        break;
      default:
        out = (
          <span>
            {"Download"}
            <i className="manicon manicon-arrow-down" />
          </span>
        );
    }
    return out;
  }

  renderTags(resource) {
    if (!resource.attributes.tagList) {
      return false;
    }

    function commaSeparate(index) {
      if (index >= resource.attributes.tagList.length - 1) return false;
      return (
        <span>
          {", "}
        </span>
      );
    }

    return (
      <nav className="resource-tags">
        <ul>
          {resource.attributes.tagList.map((tag, index) => {
            return (
              <div
                key={tag}
                className="tag-link"
                onMouseOver={this.handleTagHover}
                onClick={this.handleTagClick}
              >
                {tag}
                {commaSeparate(index)}
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

    const infoClass = classNames({
      "resource-info": true,
      hover: this.state.infoHover
    });
    return (
      <li className="resource-card">
        <Resource.Preview resource={resource}>
          <div className="resource-link" onClick={this.handlePreviewClick}>
            <Resource.Thumbnail resource={resource} />
            <div className="preview-text">
              {this.getPreviewText(attr)}
            </div>
          </div>
        </Resource.Preview>
        <section
          className={infoClass}
          onMouseOver={this.handleInfoMouseOver}
          onMouseOut={this.handleInfoMouseOut}
          onClick={this.handleInfoClick}
        >
          <div>
            <header className="resource-title">
              <h4 dangerouslySetInnerHTML={{ __html: attr.titleFormatted }} />
            </header>
            <span className="resource-date">
              Uploaded{" "}
              <FormattedDate format="MMMM, YYYY" date={attr.createdAt} />
            </span>
            <div to={this.detailUrl()} className="arrow-link">
              <i className="manicon manicon-arrow-right" />
            </div>
          </div>

          {this.renderTags(resource)}
        </section>
      </li>
    );
  }
}

export default withRouter(ResourceCard);

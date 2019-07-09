import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import FormattedDate from "global/components/FormattedDate";
import Resourceish from "frontend/components/resourceish";
import Preview from "frontend/components/resource-preview";
import TagList from "./TagList";
import IconComposer from "global/components/utility/IconComposer";

import lh from "helpers/linkHandler";

class ResourceCard extends Component {
  static displayName = "Card";

  static propTypes = {
    history: PropTypes.object.isRequired,
    resource: PropTypes.object,
    project: PropTypes.object.isRequired,
    resourceCollection: PropTypes.object,
    itemHeadingLevel: PropTypes.oneOf([2, 3, 4, 5, 6])
  };

  static defaultProps = {
    itemHeadingLevel: 4
  };

  constructor() {
    super();
    this.state = {
      infoHover: false
    };
  }

  get titleTag() {
    return `h${this.props.itemHeadingLevel}`;
  }

  getResourceType(type) {
    let formattedType =
      type
        .toLowerCase()
        .charAt(0)
        .toUpperCase() + type.slice(1);
    if (type.toLowerCase() === "pdf") {
      formattedType = "PDF";
    }
    return formattedType;
  }

  getPreviewText(attr) {
    const type = attr.kind;
    const text = attr.downloadable ? (
      this.renderDownloadablePreview(type)
    ) : (
      <React.Fragment>
        <span className="resource-card__view-text">{"View"}</span>
        <IconComposer
          icon="arrowRight16"
          size="default"
          iconClass="resource-card__view-icon"
        />
      </React.Fragment>
    );
    return text;
  }

  detailUrl() {
    if (this.props.resourceCollection) {
      return lh.link(
        "frontendProjectCollectionResource",
        this.props.project.attributes.slug,
        this.props.resourceCollection.attributes.slug,
        this.props.resource.attributes.slug
      );
    }
    return lh.link(
      "frontendProjectResource",
      this.props.project.attributes.slug,
      this.props.resource.attributes.slug
    );
  }

  previewable(resource) {
    return Preview.canPreview(resource);
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

  handlePreviewClick = event => {
    event.preventDefault();
    const resource = this.props.resource;
    if (this.downloadable(resource)) return this.doDownload(resource);
    if (this.linkable(resource)) return this.openLink(resource);
    // Open the resource detail view if all else fails.
    return this.handleInfoClick();
  };

  handleInfoMouseOver = () => {
    this.setState({
      infoHover: true
    });
  };

  handleInfoMouseOut = () => {
    this.setState({
      infoHover: false
    });
  };

  handleInfoClick = () => {
    this.props.history.push(this.detailUrl());
  };

  renderDownloadablePreview(type) {
    if (!type) return null;
    let out = null;
    switch (type.toLowerCase()) {
      case "image":
      case "interactive":
        out = (
          <React.Fragment>
            <span className="resource-card__view-text">{"Preview"}</span>
            <IconComposer
              icon="eyeOpen16"
              size={21.333}
              iconClass="resource-card__view-icon"
            />
          </React.Fragment>
        );
        break;
      case "link":
        out = (
          <React.Fragment>
            <span className="resource-card__view-text">{"Visit"}</span>
            <IconComposer
              icon="arrowRight16"
              size="default"
              iconClass="resource-card__view-icon"
            />
          </React.Fragment>
        );
        break;
      case "video":
        out = (
          <React.Fragment>
            <span className="resource-card__view-text">{"Play"}</span>
            <IconComposer
              icon="play16"
              size={19.2}
              iconClass="resource-card__view-icon"
            />
          </React.Fragment>
        );
        break;
      default:
        out = (
          <React.Fragment>
            <span className="resource-card__view-text">{"Download"}</span>
            <IconComposer
              icon="arrowDown16"
              size="default"
              iconClass="resource-card__view-icon"
            />
          </React.Fragment>
        );
    }
    return out;
  }

  render() {
    const resource = this.props.resource;
    if (!resource) return null;
    const attr = resource.attributes;
    const Title = props => (
      <this.titleTag
        className="resource-card__title"
        dangerouslySetInnerHTML={{ __html: props.children }}
      />
    );
    const PreviewLink = props => {
      const linkProps = !this.previewable(resource) && {
        onClick: this.handlePreviewClick,
        role: "link",
        tabIndex: "0"
      };

      return (
        <div className="resource-card__link" {...linkProps}>
          {props.children}
        </div>
      );
    };

    const infoClass = classNames({
      "resource-card__info": true,
      "resource-card__info--hover": this.state.infoHover
    });

    return (
      <li className="resource-card">
        <Preview resource={resource}>
          <PreviewLink>
            <Resourceish.Thumbnail resourceish={resource} />
            <div className="resource-card__preview-text">
              {this.getPreviewText(attr)}
            </div>
          </PreviewLink>
        </Preview>
        {/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */}
        <section
          className={infoClass}
          onMouseOver={this.handleInfoMouseOver}
          onMouseOut={this.handleInfoMouseOut}
          onClick={this.handleInfoClick}
          role="link"
          tabIndex="0"
        >
          {/* eslint-enable jsx-a11y/no-noninteractive-element-to-interactive-role */}
          <div>
            <header>
              <Title>{attr.titleFormatted}</Title>
            </header>
            <span className="resource-card__date">
              Uploaded{" "}
              <FormattedDate format="MMMM, YYYY" date={attr.createdAt} />
            </span>
            <div to={this.detailUrl()} className="resource-card__arrow-link">
              <IconComposer
                icon="arrowRight16"
                size={20}
                iconClass="resource-card__arrow-link-icon"
              />
            </div>
          </div>
          <TagList resource={resource} />
        </section>
      </li>
    );
  }
}

export default withRouter(ResourceCard);

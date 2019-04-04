import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import get from "lodash/get";
import debounce from "lodash/debounce";
import lh from "helpers/linkHandler";
import isEmpty from "lodash/isEmpty";
import { Collapse } from "react-collapse";
import IconComposer from "global/components/utility/IconComposer";

export default class ResourceListSlideCaption extends Component {
  static visibleCaptionHeight = 48;

  static propTypes = {
    resource: PropTypes.object,
    resourceCollection: PropTypes.object,
    hideDetailUrl: PropTypes.bool,
    hideDownload: PropTypes.bool
  };

  static defaultProps = {
    hideDetailUrl: false,
    hideDownload: false
  };

  constructor() {
    super();
    this.state = {
      init: true,
      expanded: false
    };
  }

  componentDidMount() {
    this.checkExpandable();

    // Check expandable on resize
    const debouncedExpand = debounce(this.checkExpandable, 120);
    window.addEventListener("resize", debouncedExpand);
  }

  componentDidUpdate() {
    this.checkExpandable();
  }

  canDownload(resource) {
    if (this.props.hideDownload) return false;
    return get(resource, "attributes.downloadable") || false;
  }

  hasCaption(resource) {
    return !isEmpty(get(resource, "attributes.captionFormatted"));
  }

  handleReadMore = () => {
    if (!this.canExpand()) return;

    this.setState({
      expanded: !this.state.expanded
    });
  };

  createDescription(description) {
    return {
      __html: description || ""
    };
  }

  canExpand() {
    if (!this._utility) return false;
    if (!this._descriptionContents) return false;
    return (
      this._descriptionContents.offsetHeight >
      ResourceListSlideCaption.visibleCaptionHeight
    );
  }

  checkExpandable = () => {
    if (!this._utility) return;
    if (this.canExpand()) return this.showExpandable();
    this.hideExpandable();
  };

  hideExpandable() {
    this._utility.classList.remove("resource-slideshow__utility--expandable");
  }

  showExpandable() {
    this._utility.classList.add("resource-slideshow__utility--expandable");
  }

  checkCollapsed = () => {
    if (!this._description) return null;
    if (this.state.expanded) {
      this._description.classList.remove(
        "resource-slideshow__description--collapsed"
      );
    } else {
      this._description.classList.add(
        "resource-slideshow__description--collapsed"
      );
    }
  };

  detailUrl() {
    const { resource, resourceCollection } = this.props;
    if (resourceCollection) {
      return lh.link(
        "frontendProjectCollectionResource",
        resource.attributes.projectSlug,
        resourceCollection.attributes.slug,
        resource.attributes.slug
      );
    }
    return lh.link(
      "frontendProjectResource",
      resource.attributes.projectSlug,
      resource.attributes.slug
    );
  }

  renderDescription(resource) {
    if (!this.hasCaption(resource)) return null;
    const attr = resource.attributes;
    const descriptionClasses = classNames({
      "resource-slideshow__description": true,
      "resource-slideshow__description--expanded": this.state.expanded
    });
    const contents = this.createDescription(attr.captionFormatted);

    return (
      <Collapse isOpened onRest={this.checkCollapsed}>
        <div className={descriptionClasses} ref={e => (this._description = e)}>
          <div
            ref={e => {
              this._descriptionContents = e;
            }}
            dangerouslySetInnerHTML={contents}
          />
        </div>
      </Collapse>
    );
  }

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;
    const moreLinkClass = classNames("resource-slideshow__more-link", {
      "resource-slideshow__more-link--open": this.state.expanded
    });

    const utilityClass = classNames("resource-slideshow__utility", {
      "resource-slideshow__utility--with-shadow": this.hasCaption(resource),
      "resource-slideshow__utility--expanded": this.state.expanded
    });

    const detailUrl = this.detailUrl();

    return (
      <div className="resource-slideshow__caption">
        <header>
          <h2
            className="resource-slideshow__title"
            dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
          />
          <span className="screen-reader-text" role="alert">
            Showing {attr.type} resource: {attr.title}
          </span>
        </header>
        {this.renderDescription(resource)}
        <div
          className={utilityClass}
          ref={e => {
            this._utility = e;
          }}
        >
          <div className="resource-slideshow__utility-inner">
            <button className={moreLinkClass} onClick={this.handleReadMore}>
              <span className="resource-slideshow__open-text">
                {"Read More"}
              </span>
              <span className="resource-slideshow__close-text">
                {"Hide Description"}
              </span>
            </button>
            {this.canDownload(resource) ? (
              <a
                href={attr.attachmentStyles.original}
                target="_blank"
                className="resource-slideshow__download-link"
                rel="noopener noreferrer"
              >
                <span>{"Download"}</span>
                <IconComposer
                  icon="arrowDown16"
                  size="default"
                  iconClass="resource-slideshow__download-icon"
                />
              </a>
            ) : null}
            {detailUrl && !this.props.hideDetailUrl ? (
              <Link className="resource-slideshow__detail-link" to={detailUrl}>
                {"View Resource"}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

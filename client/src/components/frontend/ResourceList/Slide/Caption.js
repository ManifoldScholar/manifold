import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import get from "lodash/get";
import debounce from "lodash/debounce";
import lh from "helpers/linkHandler";
import isEmpty from "lodash/isEmpty";
import { Collapse } from "react-collapse";

export default class ResourceListSlideCaption extends Component {
  static visibleCaptionHeight = 48;

  static propTypes = {
    resource: PropTypes.object,
    collection: PropTypes.object,
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
    this._utility.classList.remove("expandable");
  }

  showExpandable() {
    this._utility.classList.add("expandable");
  }

  checkCollapsed = () => {
    if (!this._description) return null;
    if (this.state.expanded) {
      this._description.classList.remove("collapsed");
    } else {
      this._description.classList.add("collapsed");
    }
  };

  detailUrl() {
    const { resource, collection } = this.props;
    if (collection) {
      return lh.link(
        "frontendProjectCollectionResource",
        resource.attributes.projectSlug,
        collection.attributes.slug,
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
      "resource-description": true,
      expanded: this.state.expanded
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
    const moreLinkClass = classNames("more-link", {
      open: this.state.expanded
    });

    const utilityClass = classNames("resource-utility", {
      "with-shadow": this.hasCaption(resource),
      expanded: this.state.expanded
    });

    const detailUrl = this.detailUrl();

    return (
      <div className="slide-caption">
        <header>
          <h2
            className="resource-title"
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
          <div className="wrapper">
            <button className={moreLinkClass} onClick={this.handleReadMore}>
              <span className="open-text">{"Read More"}</span>
              <span className="close-text">{"Hide Description"}</span>
            </button>
            {this.canDownload(resource) ? (
              <a
                href={attr.attachmentStyles.original}
                target="_blank"
                className="download-link"
                rel="noopener noreferrer"
              >
                {"Download"}
                <i className="manicon manicon-arrow-down" aria-hidden="true" />
              </a>
            ) : null}
            {detailUrl && !this.props.hideDetailUrl ? (
              <Link className="detail-link" to={detailUrl}>
                {"View Resource"}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

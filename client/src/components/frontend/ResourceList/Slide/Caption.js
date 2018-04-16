import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import get from "lodash/get";
import debounce from "lodash/debounce";
import lh from "helpers/linkHandler";
import isEmpty from "lodash/isEmpty";
import Loadable from "react-loadable";

const Velocity = Loadable({
  loader: () =>
    import(/* webpackChunkName: "velocity-react" */ "velocity-react").then(
      velocity => velocity.VelocityComponent
    ),
  loading: () => null
});

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
      expanded: false,
      targetHeight: "5em"
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

  getFullDescriptionHeight() {
    if (!this._description) return;
    this._description.style.height = "auto";
    const measuredHeight = this._description.offsetHeight;
    this._description.style.height = "3em";
    return measuredHeight + "px";
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
    if (!this.state.expanded) {
      this.setState({
        targetHeight: this.getFullDescriptionHeight()
      });
    }

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

    // Animation to open description
    const animation = {
      animation: {
        height: this.state.expanded ? this.state.targetHeight : "3em"
      },
      duration: 250,
      complete: () => {
        if (this.state.expanded) {
          this._description.style.height = "auto";
        }
      }
    };

    return (
      <div className="slide-caption" onClick={this.handleReadMore}>
        <header>
          <h2
            className="resource-title"
            dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
          />
        </header>
        {this.hasCaption(resource) ? (
          <Velocity {...animation}>
            <div
              className="resource-description"
              ref={e => {
                this._description = e;
              }}
            >
              <div
                ref={e => {
                  this._descriptionContents = e;
                }}
                dangerouslySetInnerHTML={this.createDescription(
                  attr.captionFormatted
                )}
              />
            </div>
          </Velocity>
        ) : null}
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
              >
                {"Download"}
                <i className="manicon manicon-arrow-down" />
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

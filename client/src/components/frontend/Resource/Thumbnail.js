import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import get from "lodash/get";
import Icon from "./Icon";

export default class ResourceThumbnail extends Component {
  static displayName = "Resource.Thumbnail";

  static propTypes = {
    resource: PropTypes.object,
    showKind: PropTypes.bool,
    showTitle: PropTypes.bool,
    variant: PropTypes.string,
    noCrop: PropTypes.bool,
    additionalClasses: PropTypes.string
  };

  static defaultProps = {
    showKind: true,
    showTitle: false,
    variant: "smallPortrait",
    additionalClasses: ""
  };

  getResourceKind(kind) {
    if (!kind) return "file";
    return kind.toLowerCase().charAt(0).toUpperCase() + kind.slice(1);
  }

  getImage(resource) {
    const thumb = get(
      resource,
      `attributes.variantThumbnailStyles.${this.props.variant}`
    );
    if (thumb) return thumb;
    return get(resource, `attributes.attachmentStyles.${this.props.variant}`);
  }

  hasImage(resource) {
    return !!this.getImage(resource);
  }

  render() {
    const { resource } = this.props;
    const hasImage = this.hasImage(resource);

    const wrapperClass = classNames({
      "resource-thumbnail-primary": true,
      "bg-image": hasImage && !this.props.noCrop,
      title: this.props.showTitle
    });

    const backgroundImage =
      hasImage && !this.props.noCrop ? `url(${this.getImage(resource)})` : null;

    return (
      <div
        className={`${wrapperClass} ${this.props.additionalClasses}`}
        style={{ backgroundImage }}
      >
        <div className="wrapper">
          <figure className="asset-type">
            {this.props.showKind
              ? <figcaption>
                  {this.getResourceKind(resource.attributes.kind)}
                </figcaption>
              : null}
            {this.props.noCrop
              ? <div className="asset-image">
                  <img
                    src={this.getImage(resource)}
                    alt={resource.attributes.title}
                  />
                  <div className="image-overlay" />
                </div>
              : <i className={`resource-icon ${resource.attributes.kind}`}>
                  {resource.attributes.kind
                    ? <Icon.Composer kind={resource.attributes.kind} />
                    : null}
                </i>}
          </figure>
          {this.props.showTitle
            ? <h4
                className="asset-title"
                dangerouslySetInnerHTML={{
                  __html: resource.attributes.titleFormatted
                }}
              />
            : null}
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import get from "lodash/get";
import Utility from "global/components/utility";
import IconComputed from "global/components/icon-computed";

export default class ResourceishThumbnail extends Component {
  static defaultProps = {
    showKind: true,
    showTitle: false,
    variant: "smallPortrait",
    additionalClasses: ""
  };

  static displayName = "Resourceish.Thumbnail";

  static propTypes = {
    resourceish: PropTypes.object,
    showKind: PropTypes.bool,
    showTitle: PropTypes.bool,
    variant: PropTypes.string,
    noCrop: PropTypes.bool,
    additionalClasses: PropTypes.string
  };

  getImage(resourceish) {
    let attributeName = null;
    switch (this.type()) {
      case "resources":
        attributeName = "attachmentStyles";
        break;
      case "resourceCollections":
        attributeName = "thumbnailStyles";
        break;
      default:
        break;
    }
    const thumb = get(
      resourceish,
      `attributes.variantThumbnailStyles.${this.props.variant}`
    );
    if (thumb) return thumb;
    return get(
      resourceish,
      `attributes.${attributeName}.${this.props.variant}`
    );
  }

  getResourceKind(kind) {
    let out = "File";
    switch (this.type()) {
      case "resources":
        if (!kind) break;
        out =
          kind
            .toLowerCase()
            .charAt(0)
            .toUpperCase() + kind.slice(1);
        break;
      case "resourceCollections":
        out = "Resource Collection";
        break;
      default:
        break;
    }
    return out;
  }

  hasImage(resourceish) {
    return !!this.getImage(resourceish);
  }

  type() {
    return this.props.resourceish.type;
  }

  renderIcon(resourceish) {
    let out = null;
    switch (this.type()) {
      case "resources":
        out = (
          <i className={`icon-thumbnail-icon ${resourceish.attributes.kind}`}>
            {resourceish.attributes.kind ? (
              <IconComputed.Resource
                icon={resourceish.attributes.kind}
                size={56}
              />
            ) : null}
          </i>
        );
        break;
      case "resourceCollections":
        out = (
          <i className="icon-thumbnail-icon resource-collection">
            <Utility.IconComposer icon="resourceCollection64" size={56} />
          </i>
        );
        break;
      default:
        break;
    }
    return out;
  }

  render() {
    const { resourceish } = this.props;
    if (!resourceish) return null;
    const hasImage = this.hasImage(resourceish);

    const wrapperClass = classNames({
      "icon-thumbnail-primary": true,
      "bg-image": hasImage && !this.props.noCrop,
      title: this.props.showTitle
    });

    const backgroundImage =
      hasImage && !this.props.noCrop
        ? `url(${this.getImage(resourceish)})`
        : null;

    return (
      <div
        className={`${wrapperClass} ${this.props.additionalClasses}`}
        style={{ backgroundImage }}
      >
        <div className="wrapper">
          <figure className="icon-thumbnail-type">
            {this.props.showKind ? (
              <figcaption>
                {this.getResourceKind(resourceish.attributes.kind)}
              </figcaption>
            ) : null}
            {this.props.noCrop ? (
              <div className="icon-thumbnail-image">
                <img
                  src={this.getImage(resourceish)}
                  alt={resourceish.attributes.title}
                />
                <div className="image-overlay" />
              </div>
            ) : (
              this.renderIcon(resourceish)
            )}
          </figure>
          {this.props.showTitle ? (
            <h4
              className="icon-thumbnail-title"
              dangerouslySetInnerHTML={{
                __html: resourceish.attributes.titleFormatted
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

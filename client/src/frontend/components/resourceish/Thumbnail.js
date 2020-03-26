import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import has from "lodash/has";
import Utility from "global/components/utility";
import IconComputed from "global/components/icon-computed";

export default class ResourceishThumbnail extends Component {
  static displayName = "Resourceish.Thumbnail";

  static hasImage(resourceish, variant) {
    return this.imageKey(resourceish, variant) !== undefined;
  }

  static imageKey(resourceish, variant) {
    if (!resourceish) return false;
    const { attributes } = resourceish;
    const lookups = [
      "variantThumbnailStyles",
      "variantPosterStyles",
      "attachmentStyles"
    ];
    return lookups.find(lookup => {
      return has(attributes, `${lookup}.${variant}`);
    });
  }

  static propTypes = {
    resourceish: PropTypes.object,
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

  getImage(resourceish) {
    const key = this.constructor.imageKey(resourceish, this.props.variant);
    if (!key) return null;
    const { attributes } = resourceish;
    return attributes[key][this.props.variant];
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
          <i className={`icon-thumbnail-icon resource-collection`}>
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

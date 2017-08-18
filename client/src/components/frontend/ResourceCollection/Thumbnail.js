import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import get from "lodash/get";

export default class ResourceCollectionThumbnail extends Component {
  static displayName = "ResourceCollection.Thumbnail";

  static propTypes = {
    resourceCollection: PropTypes.object,
    showTitle: PropTypes.bool,
    variant: PropTypes.string,
    noCrop: PropTypes.bool,
    additionalClasses: PropTypes.string
  };

  static defaultProps = {
    showTitle: false,
    variant: "smallPortrait",
    noCrop: false,
    additionalClasses: ""
  };

  getImage(resource) {
    const thumb = get(
      resource,
      `attributes.thumbnailStyles.${this.props.variant}`
    );
    if (thumb) return thumb;
    return get(resource, `attributes.thumbnailStyles.${this.props.variant}`);
  }

  hasImage(resource) {
    return !!this.getImage(resource);
  }

  render() {
    const { resourceCollection } = this.props;
    const hasImage = this.hasImage(resourceCollection);

    const wrapperClass = classNames({
      "resource-thumbnail-primary": true,
      "bg-image": hasImage && !this.props.noCrop,
      title: this.props.showTitle
    });

    const backgroundImage =
      hasImage && !this.props.noCrop
        ? `url(${this.getImage(resourceCollection)})`
        : null;

    return (
      <div
        className={`${wrapperClass} ${this.props.additionalClasses}`}
        style={{ backgroundImage }}
      >
        <div className="wrapper">
          <figure className="resource-type">
            {this.props.noCrop
              ? <div className="resource-image">
                  <img
                    src={this.getImage(resourceCollection)}
                    alt={resourceCollection.attributes.title}
                  />
                  <div className="image-overlay" />
                </div>
              : null}
          </figure>
          {this.props.showTitle
            ? <h4
                className="resource-title"
                dangerouslySetInnerHTML={{
                  __html: resourceCollection.attributes.titleFormatted
                }}
              />
            : null}
        </div>
      </div>
    );
  }
}

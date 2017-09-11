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
    additionalClasses: PropTypes.string
  };

  static defaultProps = {
    showTitle: false,
    variant: "smallPortrait",
    additionalClasses: ""
  };

  getImage(collection) {
    const collectionPlaceholder = "/static/images/resource-collection.jpg";
    const thumb = get(
      collection,
      `attributes.thumbnailStyles.${this.props.variant}`
    );
    if (thumb) return thumb;
    return collectionPlaceholder;
  }

  render() {
    const { resourceCollection } = this.props;

    const wrapperClass = classNames({
      "collection-thumbnail-primary": true,
      title: this.props.showTitle
    });

    return (
      <div className={`${wrapperClass} ${this.props.additionalClasses}`}>
        <div className="wrapper">
          <figure className="asset-type">
            <div className="asset-image">
              <img
                src={this.getImage(resourceCollection)}
                alt={resourceCollection.attributes.title}
              />
              <div className="image-overlay" />
            </div>
          </figure>
          {this.props.showTitle
            ? <h4
                className="asset-title"
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

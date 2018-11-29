import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Icon } from "components/global/SVG";

export default class ResourceCollectionCover extends Component {
  static displayName = "ResourceCollection.Cover";

  static propTypes = {
    collection: PropTypes.object.isRequired,
    urlCreator: PropTypes.func.isRequired
  };

  render() {
    const collectionsBackground = "/static/images/resource-collection.jpg";
    const collection = this.props.collection;
    const attr = collection.attributes;
    const bgImage = attr.thumbnailStyles.medium
      ? attr.thumbnailStyles.medium
      : collectionsBackground;
    return (
      <li>
        <Link
          to={this.props.urlCreator(collection)}
          style={{ backgroundImage: "url(" + bgImage + ")" }}
        >
          <div className="title-overlay">
            <h4 className="collection-title">{attr.title}</h4>
            <div className="icon">
              <i className="manicon" aria-hidden="true">
                <Icon.ResourceCollection size={36} />
              </i>
              <span>{"Collection"}</span>
            </div>
          </div>
        </Link>
      </li>
    );
  }
}

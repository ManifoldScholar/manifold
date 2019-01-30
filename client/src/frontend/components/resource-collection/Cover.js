import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Icon } from "global/components/svg";

export default class ResourceCollectionCover extends Component {
  static displayName = "ResourceCollection.Cover";

  static propTypes = {
    resourceCollection: PropTypes.object.isRequired,
    urlCreator: PropTypes.func.isRequired
  };

  render() {
    const collectionsBackground = "/static/images/resource-collection.jpg";
    const resourceCollection = this.props.resourceCollection;
    const attr = resourceCollection.attributes;
    const bgImage = attr.thumbnailStyles.medium
      ? attr.thumbnailStyles.medium
      : collectionsBackground;
    return (
      <li>
        <Link
          to={this.props.urlCreator(resourceCollection)}
          style={{ backgroundImage: "url(" + bgImage + ")" }}
        >
          <div className="title-overlay">
            <h4 className="collection-title">{attr.title}</h4>
            <div className="icon">
              <i className="manicon" aria-hidden="true">
                <Icon.ResourceCollection size={48} />
              </i>
              <span>{"Resource Collection"}</span>
            </div>
          </div>
        </Link>
      </li>
    );
  }
}

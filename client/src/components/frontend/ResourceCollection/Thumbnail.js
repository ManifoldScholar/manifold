import React, { Component } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";

export default class ResourceCollectionThumbnail extends Component {
  static displayName = "ResourceCollection.Thumbnail";

  static propTypes = {
    resourceCollection: PropTypes.object,
    projectId: PropTypes.string
  };

  render() {
    const collectionsBackground = "/static/images/resource-collection.jpg";
    const collection = this.props.resourceCollection;
    const attr = collection.attributes;
    const bgImage = attr.thumbnailStyles.medium
      ? attr.thumbnailStyles.medium
      : collectionsBackground;
    return (
      <li>
        <Link
          to={lh.link(
            "frontendProjectCollection",
            this.props.projectId,
            collection.id
          )}
          style={{ backgroundImage: "url(" + bgImage + ")" }}
        >
          <div className="title-overlay">
            <h4 className="collection-title">
              {attr.title}
            </h4>
            <div className="icon">
              <i className="manicon manicon-file-box" />
              <span>
                {"Collection"}
              </span>
            </div>
          </div>
        </Link>
      </li>
    );
  }
}

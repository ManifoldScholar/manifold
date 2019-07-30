import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";

export default class ResourceCollectionCover extends Component {
  static displayName = "ResourceCollection.Cover";

  static propTypes = {
    resourceCollection: PropTypes.object.isRequired,
    urlCreator: PropTypes.func.isRequired,
    itemHeadingLevel: PropTypes.oneOf([2, 3, 4, 5, 6])
  };

  static defaultProps = {
    itemHeadingLevel: 4
  };

  get titleTag() {
    return `h${this.props.itemHeadingLevel}`;
  }

  render() {
    const collectionsBackground = "/static/images/resource-collection.jpg";
    const { resourceCollection } = this.props;
    const attr = resourceCollection.attributes;
    const bgImage = attr.thumbnailStyles.medium
      ? attr.thumbnailStyles.medium
      : collectionsBackground;
    const Title = props => (
      <this.titleTag className="collection-title">
        {props.children}
      </this.titleTag>
    );

    return (
      <li>
        <Link
          to={this.props.urlCreator(resourceCollection)}
          style={{ backgroundImage: "url(" + bgImage + ")" }}
        >
          <div className="title-overlay">
            <Title>{attr.title}</Title>
            <div className="icon">
              <Utility.IconComposer size={48} icon="resourceCollection64" />
              <span>{"Resource Collection"}</span>
            </div>
          </div>
        </Link>
      </li>
    );
  }
}

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "components/global/FormattedDate";

export default class CollectionPickerListItem extends PureComponent {
  static displayName = "Notation.Collection.PickerListItem";

  static propTypes = {
    entity: PropTypes.object,
    selectionHandler: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.selectionHandler(this.props.entity);
  }

  render() {
    const collection = this.props.entity;
    if (!collection) return null;
    const attr = collection.attributes;
    const collectionsBackground = "/static/images/resource-collection.jpg";
    const bgImage = attr.thumbnailStyles.smallSquare
      ? attr.thumbnailStyles.smallSquare
      : collectionsBackground;

    return (
      <li>
        <a href="#" onClick={this.handleClick}>
          <header>
            <figure className="cover">
              <div
                className="collection-thumbnail-primary bg-image icon-only"
                style={{ backgroundImage: "url(" + bgImage + ")" }}
              />
            </figure>
            <div className="meta">
              <h3 className="name">
                <span className="collection-title">
                  {attr.title}
                </span>
                <span className="subtitle">
                  <FormattedDate format="MMMM DD, YYYY" date={attr.createdAt} />
                </span>
              </h3>
            </div>
          </header>
        </a>
      </li>
    );
  }
}

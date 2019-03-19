import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import Resourceish from "frontend/components/resourceish";

export default class ResourceCollectionPickerListItem extends PureComponent {
  static displayName = "Notation.ResourceCollection.PickerListItem";

  static propTypes = {
    entity: PropTypes.object,
    selectionHandler: PropTypes.func,
    projectId: PropTypes.string
  };

  handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    this.props.selectionHandler(this.props.entity);
  };

  render() {
    const collection = this.props.entity;
    if (!collection) return null;
    const attr = collection.attributes;

    return (
      <li>
        <span
          role="button"
          tabIndex="0"
          className="fake-link"
          onClick={this.handleClick}
        >
          <div className="content">
            <figure className="cover">
              <Resourceish.Thumbnail
                key={collection.id}
                projectId={this.props.projectId}
                resourceish={collection}
                showTitle={false}
                showKind={false}
                additionalClasses="icon-only"
              />
            </figure>
            <div className="meta">
              <span className="name">
                <span className="collection-title truncate">{attr.title}</span>
                <span className="subtitle">
                  <FormattedDate format="MMMM DD, YYYY" date={attr.createdAt} />
                </span>
              </span>
            </div>
          </div>
        </span>
      </li>
    );
  }
}

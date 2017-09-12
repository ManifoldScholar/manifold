import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "components/global/FormattedDate";
import { Resourceish } from "components/frontend";

export default class CollectionPickerListItem extends PureComponent {
  static displayName = "Notation.Collection.PickerListItem";

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
        <a href="#" onClick={this.handleClick}>
          <header>
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

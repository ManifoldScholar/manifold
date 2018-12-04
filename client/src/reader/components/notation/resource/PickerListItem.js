import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import Resourceish from "frontend/components/resourceish";

export default class ResourcePickerListItem extends PureComponent {
  static displayName = "Notation.Resource.PickerListItem";

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
    const resource = this.props.entity;
    const attr = resource.attributes;
    return (
      <li>
        <span
          role="button"
          tabIndex="0"
          className="fake-link"
          onClick={this.handleClick}
        >
          <header>
            <figure className="cover">
              <Resourceish.Thumbnail
                key={resource.id}
                projectId={this.props.projectId}
                resourceish={resource}
                showTitle={false}
                showKind={false}
                additionalClasses="icon-only"
              />
            </figure>
            <div className="meta">
              <h3 className="name">
                <span
                  className="truncate"
                  dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
                />
                <span className="subtitle">
                  <FormattedDate format="MMMM DD, YYYY" date={attr.createdAt} />
                </span>
              </h3>
            </div>
          </header>
        </span>
      </li>
    );
  }
}

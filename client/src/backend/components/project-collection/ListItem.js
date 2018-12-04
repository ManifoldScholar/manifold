import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Handle from "backend/components/list/orderable-components/Handle";
import { Icon } from "global/components/svg";

export default class ProjectCollectionListItem extends PureComponent {
  static propTypes = {
    entity: PropTypes.object,
    clickHandler: PropTypes.func.isRequired,
    active: PropTypes.string,
    visibilityToggleHandler: PropTypes.func.isRequired
  };

  handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    return this.props.clickHandler(this.props.entity);
  };

  toggleVisibility = event => {
    event.preventDefault();
    event.stopPropagation();
    const projectCollection = this.props.entity;
    const visibility = !projectCollection.attributes.visible;

    return this.props.visibilityToggleHandler(projectCollection, visibility);
  };

  render() {
    const entity = this.props.entity;
    if (!entity) return null;

    const active = this.props.active === this.props.entity.id;
    const itemClass = classnames({
      "project-collection-list-item": true,
      selected: active
    });
    const visibleClass = entity.attributes.visible ? "visible" : "hidden";

    return (
      <div className={itemClass} onClick={this.handleClick} role="button">
        <span className="item-text">{this.props.entity.attributes.title}</span>
        <div className="icon-group">
          <span className="item-text">{entity.attributes.projectsCount}</span>
          <i
            className={`manicon ${visibleClass}`}
            onClick={this.toggleVisibility}
            role="button"
          >
            <Icon.EyeOpen
              iconClass={"eye-open"}
              size={30}
              fill={"currentColor"}
            />
            <Icon.EyeClosed
              iconClass={"eye-closed"}
              size={30}
              fill={"currentColor"}
            />
            <span className="screen-reader-text">{`Collection is ${
              entity.attributes.visible ? "visible" : "not visible"
            }`}</span>
          </i>
          <Handle />
        </div>
      </div>
    );
  }
}

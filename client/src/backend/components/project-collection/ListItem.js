import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class ProjectCollectionListItem extends PureComponent {
  static propTypes = {
    entity: PropTypes.object,
    clickHandler: PropTypes.func.isRequired,
    active: PropTypes.string,
    visibilityToggleHandler: PropTypes.func.isRequired,
    dragHandleProps: PropTypes.object,
    draggableProps: PropTypes.object,
    isDragging: PropTypes.bool,
    innerRef: PropTypes.func
  };

  get icon() {
    if (this.props.entity.attributes.visible)
      return (
        <Utility.IconComposer
          size={30}
          iconClass={"project-collection-list-item__icon eye-open"}
          icon="eyeOpen32"
        />
      );

    return (
      <Utility.IconComposer
        size={30}
        iconClass={"project-collection-list-item__icon eye-closed"}
        icon="eyeClosed32"
      />
    );
  }

  get ariaLabel() {
    const { entity } = this.props;
    const target = entity.attributes.visible ? "hidden" : "visible";
    return `Change visibility of ${entity.attributes.title} to ${target}.`;
  }

  toggleVisibility = event => {
    event.preventDefault();
    event.stopPropagation();
    const projectCollection = this.props.entity;
    const visibility = !projectCollection.attributes.visible;

    return this.props.visibilityToggleHandler(projectCollection, visibility);
  };

  handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    return this.props.clickHandler(this.props.entity);
  };

  render() {
    const { active, entity, innerRef, draggableProps, isDragging } = this.props;

    if (!entity) return null;

    const selected = active === entity.id;
    const itemClass = classNames({
      "project-collection-list-item": true,
      "project-collection-list-item--selected": selected
    });
    const innerClass = classNames({
      "project-collection-list-item__inner": true,
      "project-collection-list-item__inner--is-dragging": isDragging
    });

    const Handle = ({ dragHandleProps }) => (
      <div
        className={classNames(
          "project-collection-list-item__icon-group-item",
          "project-collection-list-item__button",
          "project-collection-list-item__button--drag-handle"
        )}
        {...dragHandleProps}
      >
        <Utility.IconComposer
          size={30}
          icon="grabber32"
          iconClass="project-collection-list-item__icon"
        />
      </div>
    );

    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
    return (
      <li ref={innerRef} className={itemClass} {...draggableProps}>
        <div className={innerClass}>
          <button
            className="project-collection-list-item__link"
            onClick={this.handleClick}
          >
            <span className="project-collection-list-item__item-text">
              {entity.attributes.title}
            </span>
          </button>
          <div className="project-collection-list-item__icon-group">
            <span
              className={classNames(
                "project-collection-list-item__icon-group-item",
                "project-collection-list-item__count"
              )}
            >
              {entity.attributes.projectsCount}
            </span>
            <button
              className={classNames(
                "project-collection-list-item__icon-group-item",
                "project-collection-list-item__button"
              )}
              onClick={this.toggleVisibility}
              aria-label={this.ariaLabel}
            >
              {this.icon}
              <span className="screen-reader-text">
                {`Collection is ${
                  entity.attributes.visible ? "visible" : "not visible"
                }`}
              </span>
            </button>
            <Handle dragHandleProps={this.props.dragHandleProps} />
          </div>
        </div>
      </li>
    );
  }
}

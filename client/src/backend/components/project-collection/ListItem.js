import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { SortableHandle } from "react-sortable-hoc";
import Utility from "global/components/utility";

export default class ProjectCollectionListItem extends PureComponent {
  static propTypes = {
    entity: PropTypes.object,
    clickHandler: PropTypes.func.isRequired,
    active: PropTypes.string,
    visibilityToggleHandler: PropTypes.func.isRequired
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
    const itemClass = classNames({
      "project-collection-list-item": true,
      "project-collection-list-item--selected": active
    });

    const Handle = SortableHandle(() => {
      return (
        <div
          className={classNames(
            "project-collection-list-item__icon-group-item",
            "project-collection-list-item__button",
            "project-collection-list-item__button--drag-handle"
          )}
        >
          <Utility.IconComposer
            size={30}
            icon="grabber32"
            iconClass="project-collection-list-item__icon"
          />
          <span className="screen-reader-text">
            Change the order of this list.
          </span>
        </div>
      );
    });

    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
    return (
      <li className={itemClass} onClick={this.handleClick}>
        <span className="project-collection-list-item__item-text">
          {this.props.entity.attributes.title}
        </span>
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
          <Handle />
        </div>
      </li>
    );
  }
}

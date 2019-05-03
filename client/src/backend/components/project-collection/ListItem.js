import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { SortableHandle } from "react-sortable-hoc";
import Utility from "global/components/utility";

export default class ProjectCollectionListItem extends PureComponent {
  static propTypes = {
    entity: PropTypes.object,
    clickHandler: PropTypes.func.isRequired,
    active: PropTypes.string,
    visibilityToggleHandler: PropTypes.func.isRequired
  };

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

  get icon() {
    if (this.props.entity.attributes.visible)
      return (
        <Utility.IconComposer size={32} iconClass="eye-open" icon="eyeOpen32" />
      );

    return (
      <Utility.IconComposer
        size={32}
        iconClass="eye-closed"
        icon="eyeClosed32"
      />
    );
  }

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

    const Handle = SortableHandle(() => {
      return (
        <i className="manicon drag-handle">
          <Utility.IconComposer size={30} icon="grabber32" />
          <span className="screen-reader-text">
            Change the order of this list.
          </span>
        </i>
      );
    });

    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
    return (
      <li className={itemClass} onClick={this.handleClick}>
        <span className="item-text">{this.props.entity.attributes.title}</span>
        <div className="icon-group">
          <span className="item-text">{entity.attributes.projectsCount}</span>
          <button
            className="button-icon-primary"
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

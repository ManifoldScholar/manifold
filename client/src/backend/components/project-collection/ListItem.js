import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";
import PopoverMenu from "global/components/popover/Menu";
import { withTranslation } from "react-i18next";

class ProjectCollectionListItem extends PureComponent {
  static propTypes = {
    entity: PropTypes.object,
    clickHandler: PropTypes.func.isRequired,
    active: PropTypes.string,
    visibilityToggleHandler: PropTypes.func.isRequired,
    dragHandleProps: PropTypes.object,
    draggableProps: PropTypes.object,
    onReorder: PropTypes.func,
    isDragging: PropTypes.bool,
    t: PropTypes.func,
    index: PropTypes.number,
    itemCount: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.popoverDisclosureRef = React.createRef();
  }

  get icon() {
    if (this.props.entity.attributes.visible)
      return (
        <Utility.IconComposer
          size={30}
          className={"project-collection-list-item__icon eye-open"}
          icon="eyeOpen32"
        />
      );

    return (
      <Utility.IconComposer
        size={30}
        className={"project-collection-list-item__icon eye-closed"}
        icon="eyeClosed32"
      />
    );
  }

  get ariaLabel() {
    const t = this.props.t;
    const { entity } = this.props;
    const visibility = entity.attributes.visible
      ? t("common.hidden")
      : t("common.visible");
    return t("project_collections.change_visibility", {
      entity: entity.attributes.title,
      visibility,
    });
  }

  toggleVisibility = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const projectCollection = this.props.entity;
    const visibility = !projectCollection.attributes.visible;

    return this.props.visibilityToggleHandler(projectCollection, visibility);
  };

  handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return this.props.clickHandler(this.props.entity);
  };

  onKeyboardMove = (direction) => {
    const { entity, index, onReorder } = this.props;
    const newIndex = direction === "down" ? index + 1 : index - 1;

    const callback = () => {
      setTimeout(() => {
        // refs are unreliably here due to rerendering caused by ancestor components
        const disclosureToggleEl = document.querySelector(
          `[data-disclosure-toggle-for="${entity.id}"]`,
        );
        if (disclosureToggleEl) {
          disclosureToggleEl.focus();
        }
      }, 300);
    };

    const result = {
      id: entity.id,
      title: entity.attributes.title,
      position: newIndex + 1,
      announce: true,
      callback,
    };
    onReorder(result);
  };

  render() {
    const {
      active,
      entity,
      index,
      itemCount,
      innerRef,
      dragHandleProps,
      draggableProps,
      isDragging,
    } = this.props;
    const t = this.props.t;

    if (!entity) return null;

    const selected = active === entity.id;
    const itemClass = classNames({
      "project-collection-list-item": true,
      "project-collection-list-item--selected": selected,
    });
    const innerClass = classNames({
      "project-collection-list-item__inner": true,
      "project-collection-list-item__inner--is-dragging": isDragging,
    });

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
                "project-collection-list-item__count",
              )}
            >
              {entity.attributes.projectsCount}
            </span>
            <button
              className={classNames(
                "project-collection-list-item__icon-group-item",
                "project-collection-list-item__button",
              )}
              onClick={this.toggleVisibility}
              aria-label={this.ariaLabel}
            >
              {this.icon}
              <span className="screen-reader-text">
                {entity.attributes.visible
                  ? t("project_collections.collection_is_visible")
                  : t("project_collections.collection_is_not_visible")}
              </span>
            </button>
            <div
              className={classNames(
                "project-collection-list-item__icon-group-item",
                "project-collection-list-item__button",
                "project-collection-list-item__button--drag-handle",
              )}
              {...dragHandleProps}
              tabIndex={-1}
            >
              <Utility.IconComposer
                size={30}
                icon="grabber32"
                className="project-collection-list-item__icon"
              />
            </div>
            <div className="project-collection-list-item__keyboard-buttons">
              <PopoverMenu
                disclosure={
                  <button
                    ref={this.popoverDisclosureRef}
                    data-disclosure-toggle-for={entity.id}
                    className={classNames(
                      "project-collection-list-item__icon-group-item",
                      "project-collection-list-item__button",
                    )}
                  >
                    <Utility.IconComposer icon="arrowUpDown32" size={30} />
                    <span className="screen-reader-text">
                      {this.props.t("actions.dnd.reorder")}
                    </span>
                  </button>
                }
                actions={[
                  {
                    id: "up",
                    label: this.props.t("actions.dnd.move_up_position"),
                    onClick: () => this.onKeyboardMove("up"),
                    disabled: index === 0,
                  },
                  {
                    id: "down",
                    label: this.props.t("actions.dnd.move_down_position"),
                    onClick: () => this.onKeyboardMove("down"),
                    disabled: index === itemCount - 1,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default withTranslation()(ProjectCollectionListItem);

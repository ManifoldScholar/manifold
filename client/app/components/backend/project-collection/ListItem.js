import { useRef } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Utility from "components/global/utility";
import PopoverMenu from "components/global/popover/Menu";

export default function ProjectCollectionListItem({
  entity,
  clickHandler,
  active,
  visibilityToggleHandler,
  dragHandleProps,
  draggableProps,
  onReorder,
  isDragging,
  index,
  itemCount,
  innerRef
}) {
  const { t } = useTranslation();
  const popoverDisclosureRef = useRef(null);

  if (!entity) return null;

  const icon = entity.attributes.visible ? (
    <Utility.IconComposer
      size={30}
      className={"project-collection-list-item__icon eye-open"}
      icon="eyeOpen32"
    />
  ) : (
    <Utility.IconComposer
      size={30}
      className={"project-collection-list-item__icon eye-closed"}
      icon="eyeClosed32"
    />
  );

  const ariaLabel = (() => {
    const visibility = entity.attributes.visible
      ? t("common.hidden")
      : t("common.visible");
    return t("project_collections.change_visibility", {
      entity: entity.attributes.title,
      visibility
    });
  })();

  const toggleVisibility = event => {
    event.preventDefault();
    event.stopPropagation();
    const visibility = !entity.attributes.visible;
    return visibilityToggleHandler(entity, visibility);
  };

  const handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    return clickHandler(entity);
  };

  const onKeyboardMove = direction => {
    const newIndex = direction === "down" ? index + 1 : index - 1;

    const callback = () => {
      setTimeout(() => {
        const disclosureToggleEl = document.querySelector(
          `[data-disclosure-toggle-for="${entity.id}"]`
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
      callback
    };
    onReorder(result);
  };

  const selected = active === entity.id;
  const itemClass = classNames({
    "project-collection-list-item": true,
    "project-collection-list-item--selected": selected
  });
  const innerClass = classNames({
    "project-collection-list-item__inner": true,
    "project-collection-list-item__inner--is-dragging": isDragging
  });

  return (
    <li ref={innerRef} className={itemClass} {...draggableProps}>
      <div className={innerClass}>
        <button
          className="project-collection-list-item__link"
          onClick={handleClick}
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
            onClick={toggleVisibility}
            aria-label={ariaLabel}
          >
            {icon}
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
              "project-collection-list-item__button--drag-handle"
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
                  ref={popoverDisclosureRef}
                  data-disclosure-toggle-for={entity.id}
                  className={classNames(
                    "project-collection-list-item__icon-group-item",
                    "project-collection-list-item__button"
                  )}
                >
                  <Utility.IconComposer icon="arrowUpDown32" size={30} />
                  <span className="screen-reader-text">
                    {t("actions.dnd.reorder")}
                  </span>
                </button>
              }
              actions={[
                {
                  id: "up",
                  label: t("actions.dnd.move_up_position"),
                  onClick: () => onKeyboardMove("up"),
                  disabled: index === 0
                },
                {
                  id: "down",
                  label: t("actions.dnd.move_down_position"),
                  onClick: () => onKeyboardMove("down"),
                  disabled: index === itemCount - 1
                }
              ]}
            />
          </div>
        </div>
      </div>
    </li>
  );
}

ProjectCollectionListItem.displayName = "ProjectCollection.ListItem";

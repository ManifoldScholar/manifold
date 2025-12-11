import { useRef, useId } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { isArray, isEmpty, isFunction, isString } from "lodash-es";
import LabelSet from "./LabelSet";
import { Link } from "react-router";
import Utility from "components/global/utility";
import PopoverMenu from "components/global/popover/Menu";
import { useTranslation } from "react-i18next";

function EntitiesListRow({
  onRowClick,
  rowClickMode = "inline",
  title,
  titlePlainText,
  count,
  meta,
  subtitle,
  figure,
  figureSize = "normal",
  figureShape = "square",
  figureAlign,
  figureHasWrapper,
  label,
  active = false,
  listStyle = "rows",
  sortableStyle = "spaced",
  utility,
  dragHandleProps,
  draggableProps,
  isDragging,
  innerRef,
  index,
  entityCount,
  onKeyboardMove,
  linkState,
  prepend
}) {
  const id = useId();
  const { t } = useTranslation();
  const popoverDisclosureRef = useRef(null);

  // eslint-disable-next-line no-nested-ternary
  const labels = isArray(label) ? label : label ? [label] : [];
  const verticalAlignment =
    figureAlign || (subtitle || meta ? "top" : "center");

  const isSortable =
    isFunction(innerRef) &&
    draggableProps &&
    dragHandleProps &&
    !isEmpty(draggableProps) &&
    !isEmpty(dragHandleProps);

  const entireRowIsClickable = rowClickMode === "block" && onRowClick;

  const resolvedTitlePlainText = titlePlainText || title;

  const itemClassNames = classNames({
    "entity-row entity-list__entity": true,
    "scheme-dark entity-row--bulk-actions": !!prepend
  });

  const figureClassNames = classNames({
    "entity-row__figure": true,
    "entity-row__figure--valign-center": verticalAlignment === "center",
    "entity-row__figure--size-small": figureSize === "small",
    "entity-row__figure--size-medium": figureSize === "medium",
    "entity-row__figure--size-normal": figureSize === "normal",
    "entity-row__figure--shape-round": figureShape === "circle",
    "entity-row__figure--shape-square": figureShape === "square",
    "entity-row__figure--in-grid": listStyle === "grid",
    "entity-row__figure--in-well": listStyle === "well",
    "entity-row--figure--in-tiles": listStyle === "tiles",
    "entity-row--figure--in-rows": listStyle === "rows"
  });

  const rowClassNames = classNames({
    "entity-row__inner": true,
    "entity-row__inner--in-grid": listStyle === "grid",
    "entity-row__inner--in-well": listStyle === "well",
    "entity-row__inner--in-tiles": listStyle === "tiles",
    "entity-row__inner--in-rows": listStyle === "rows",
    "entity-row__inner--with-row-link": entireRowIsClickable,
    "entity-row__inner--sortable": isSortable,
    "entity-row__inner--sortable-tight":
      isSortable && sortableStyle === "tight",
    "entity-row__inner--is-dragging": isDragging
  });

  const textClassNames = classNames({
    "entity-row__text": true,
    "entity-row__text--valign-center": verticalAlignment === "center",
    "entity-row__text--in-grid": listStyle === "grid",
    "entity-row__text--in-tiles": listStyle === "tiles",
    "entity-row__text--in-rows": listStyle === "rows"
  });

  const titleClassNames = classNames({
    "entity-row__title": true,
    "entity-row__title--in-grid": listStyle === "grid",
    "entity-row__title--in-well": listStyle === "well",
    "entity-row__title--in-tiles": listStyle === "tiles",
    "entity-row__title--in-rows": listStyle === "rows"
  });

  const subtitleClassNames = classNames({
    "entity-row__subtitle": true,
    "entity-row__subtitle--in-grid": listStyle === "grid",
    "entity-row__subtitle--in-well": listStyle === "well",
    "entity-row__subtitle--in-tiles": listStyle === "tiles",
    "entity-row__subtitle--in-rows": listStyle === "rows"
  });

  const countClassNames = classNames({
    "entity-row__count": true,
    "entity-row__count--in-grid": listStyle === "grid",
    "entity-row__count--in-well": listStyle === "well",
    "entity-row__count--in-tiles": listStyle === "tiles",
    "entity-row__count--in-rows": listStyle === "rows"
  });

  const metaClassNames = classNames({
    "entity-row__meta": true,
    "entity-row__meta--in-grid": listStyle === "grid",
    "entity-row__meta--in-well": listStyle === "well",
    "entity-row__meta--in-tiles": listStyle === "tiles",
    "entity-row__meta--in-rows": listStyle === "rows"
  });

  function wrapWithAnchor(child, childId, url, block = false, tabIndex = 0) {
    const className = classNames({
      "entity-row__row-link": true,
      "entity-row__row-link--block": block,
      "entity-row__row-link--atag": true,
      "entity-row__row-link--in-grid": listStyle === "grid",
      "entity-row__row-link--in-well": listStyle === "well",
      "entity-row__row-link--is-active": active
    });

    return (
      <Link
        className={className}
        to={{ pathname: url, state: linkState }}
        aria-describedby={`${childId}-describedby`}
        tabIndex={tabIndex < 0 ? tabIndex : undefined}
      >
        {child}
      </Link>
    );
  }

  function wrapWithButton(child, onClick, block = false, tabIndex = 0) {
    const className = classNames({
      "entity-row__row-link": true,
      "entity-row__row-link--block": block,
      "entity-row__row-link--button": true,
      "entity-row__row-link--in-grid": listStyle === "grid",
      "entity-row__row-link--in-well": listStyle === "well",
      "entity-row__row-link--is-active": active
    });
    return (
      <button
        className={className}
        onClick={onClick}
        tabIndex={tabIndex < 0 ? tabIndex : undefined}
      >
        {child}
      </button>
    );
  }

  function wrapWithDragHandler(child) {
    return (
      <div
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        className="entity-row__drag-container"
      >
        {child}
      </div>
    );
  }

  function wrapWithClickHandler(child, childId, block = false, tabIndex) {
    if (!onRowClick) return child;
    if (isString(onRowClick))
      return wrapWithAnchor(child, childId, onRowClick, block, tabIndex);
    return wrapWithButton(child, onRowClick, block, tabIndex);
  }

  function inlineLink(child, childId, tabIndex) {
    if (rowClickMode !== "inline") return child;
    return wrapWithClickHandler(child, childId, false, tabIndex);
  }

  function blockLink(child, childId) {
    if (isSortable) return wrapWithDragHandler(child);
    if (!entireRowIsClickable) return child;
    return wrapWithClickHandler(child, childId, true);
  }

  function handleKeyboardMove(direction) {
    const draggableId = draggableProps?.["data-rbd-draggable-id"];
    if (!draggableId) return;

    onKeyboardMove(
      draggableId,
      title,
      index,
      direction === "up" ? index - 1 : index + 1,
      () => {
        if (popoverDisclosureRef?.current) {
          popoverDisclosureRef.current.focus();
        }
      }
    );
  }

  const dragHandle = isSortable ? (
    <>
      <span
        className="entity-row__utility-button entity-row__utility-button--handle"
        aria-hidden
      >
        <Utility.IconComposer icon="grabber32" size={26} />
      </span>
      <div className="entity-row__utility-keyboard-buttons">
        <PopoverMenu
          disclosure={
            <button
              ref={popoverDisclosureRef}
              className="entity-row__utility-button"
            >
              <Utility.IconComposer icon="arrowUpDown32" size={26} />
              <span className="screen-reader-text">
                {t("actions.dnd.reorder")}
              </span>
            </button>
          }
          actions={[
            {
              id: "up",
              label: t("actions.dnd.move_up_position"),
              onClick: () => handleKeyboardMove("up"),
              disabled: index === 0
            },
            {
              id: "down",
              label: t("actions.dnd.move_down_position"),
              onClick: () => handleKeyboardMove("down"),
              disabled: index === entityCount - 1
            }
          ]}
        />
      </div>
    </>
  ) : null;

  return (
    <li className={itemClassNames}>
      {!!prepend && <>{prepend}</>}
      {blockLink(
        <div className={rowClassNames}>
          {figure &&
            (figureHasWrapper ? (
              inlineLink(figure, undefined, title ? -1 : 0)
            ) : (
              <div className={figureClassNames}>
                {inlineLink(figure, undefined, title ? -1 : 0)}
              </div>
            ))}
          <div className={textClassNames}>
            {title && (
              <h3 className={titleClassNames}>
                <span className="entity-row__title-inner">
                  {inlineLink(title, id)}
                </span>
                {!!labels.length && <LabelSet labels={labels} />}
                <span id={`${id}-describedby`} className="screen-reader-text">
                  {t("actions.view_item", {
                    item:
                      typeof resolvedTitlePlainText === "string"
                        ? resolvedTitlePlainText
                        : "item"
                  })}
                </span>
              </h3>
            )}
            {!title && !!labels.length && <LabelSet labels={labels} />}
            {!!subtitle && <h4 className={subtitleClassNames}>{subtitle}</h4>}
            {!!count && <h4 className={countClassNames}>{count}</h4>}
            {!!meta && <div className={metaClassNames}>{meta}</div>}
          </div>
          {(utility || isSortable) && (
            <div className="entity-row__utility">
              <>
                {utility}
                {dragHandle}
              </>
            </div>
          )}
        </div>,
        id
      )}
    </li>
  );
}

EntitiesListRow.displayName = "List.EntitiesList.Entity.Row";

EntitiesListRow.propTypes = {
  onRowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  rowClickMode: PropTypes.oneOf(["inline", "block"]),
  title: PropTypes.node,
  titlePlainText: PropTypes.string,
  count: PropTypes.node,
  meta: PropTypes.node,
  subtitle: PropTypes.node,
  figure: PropTypes.node,
  figureSize: PropTypes.oneOf(["small", "normal"]),
  figureShape: PropTypes.oneOf(["circle", "square"]),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.node
  ]),
  active: PropTypes.bool,
  listStyle: PropTypes.oneOf(["rows", "tiles", "grid", "bare", "well"]),
  sortableStyle: PropTypes.oneOf(["tight", "spaced"]),
  utility: PropTypes.node,
  dragHandleProps: PropTypes.object,
  draggableProps: PropTypes.object,
  isDragging: PropTypes.bool,
  innerRef: PropTypes.func,
  index: PropTypes.number,
  entityCount: PropTypes.number,
  onKeyboardMove: PropTypes.func
};

export default EntitiesListRow;

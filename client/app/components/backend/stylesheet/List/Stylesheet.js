import { useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "components/global/utility";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import FormattedDate from "components/global/FormattedDate";
import PopoverMenu from "components/global/popover/Menu";
import DropEdgeIndicator from "components/global/dnd/DropEdgeIndicator";
import { useReorderableItem } from "hooks";

export default function Stylesheet({
  stylesheet,
  text,
  callbacks,
  index,
  instanceId,
  stylesheetCount,
  onKeyboardMove,
  onBeforeDestroy
}) {
  const { t } = useTranslation();
  const popoverDisclosureRef = useRef(null);

  // `setElement` refs the whole row (draggable + drop target); `setHandle` refs
  // the grabber icon, so the nested edit link stays clickable.
  const { setElement, setHandle, isDragging, closestEdge } = useReorderableItem(
    {
      instanceId,
      itemId: stylesheet.id,
      dragData: { id: stylesheet.id, index }
    }
  );

  const baseClass = "ordered-records-item";
  const editUrl = `/backend/projects/text/${text.id}/styles/${stylesheet.id}`;
  const type = stylesheet.attributes.ingested
    ? t("texts.stylesheets.ingested")
    : t("texts.stylesheets.user_created");

  const confirmDestroy = event => {
    event.preventDefault();
    if (onBeforeDestroy) onBeforeDestroy(stylesheet.id);
    callbacks.confirmDestroy(stylesheet);
  };

  const focusDisclosure = () => {
    if (popoverDisclosureRef?.current) popoverDisclosureRef.current.focus();
  };

  return (
    <div
      ref={setElement}
      className={classNames({
        [`${baseClass}`]: true,
        [`${baseClass}--is-dragging`]: isDragging
      })}
    >
      <DropEdgeIndicator
        edge={closestEdge}
        baseClass={`${baseClass}__drop-indicator`}
      />
      <div className={`${baseClass}__inner`}>
        <Link className={`${baseClass}__details`} to={editUrl}>
          <div className={`${baseClass}__icon`}>
            <Utility.IconComposer icon="resourceDocument64" size={50} />
          </div>
          <div className={`${baseClass}__title-wrapper`}>
            <h3 className={`${baseClass}__title`}>
              {stylesheet.attributes.name}
              <span className={`${baseClass}__subtitle`}>{type}</span>
            </h3>
            <span className={`${baseClass}__date`}>
              <FormattedDate
                prefix={t("dates.added_on")}
                format="MMMM, yyyy"
                date={stylesheet.attributes.createdAt}
              />
            </span>
          </div>
        </Link>
        <div className={`${baseClass}__utility`}>
          <button
            data-id="destroy"
            className={`${baseClass}__button ${baseClass}__button--notice`}
            onClick={confirmDestroy}
          >
            <Utility.IconComposer icon="delete32" size={26} />
            <span className="screen-reader-text">
              {t("texts.stylesheets.delete_button_label")}
            </span>
          </button>
          <Link className={`${baseClass}__button`} to={editUrl}>
            <Utility.IconComposer icon="annotate32" size={26} />
            <span className="screen-reader-text">
              {t("texts.stylesheets.edit_button_label")}
            </span>
          </Link>
          <div
            ref={setHandle}
            tabIndex={-1}
            className={`${baseClass}__button`}
            aria-hidden
          >
            <Utility.IconComposer icon="grabber32" size={26} />
          </div>
          <div className={`${baseClass}__keyboard-buttons`}>
            <PopoverMenu
              disclosure={
                <button
                  ref={popoverDisclosureRef}
                  className={`${baseClass}__button`}
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
                  onClick: () =>
                    onKeyboardMove({
                      id: stylesheet.id,
                      title: stylesheet.attributes.name,
                      index,
                      direction: "up",
                      callback: focusDisclosure
                    }),
                  disabled: index === 0
                },
                {
                  id: "down",
                  label: t("actions.dnd.move_down_position"),
                  onClick: () =>
                    onKeyboardMove({
                      id: stylesheet.id,
                      title: stylesheet.attributes.name,
                      index,
                      direction: "down",
                      callback: focusDisclosure
                    }),
                  disabled: index === stylesheetCount - 1
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Stylesheet.displayName = "Stylesheet.List.Stylesheet";

Stylesheet.propTypes = {
  stylesheet: PropTypes.object.isRequired,
  text: PropTypes.object.isRequired,
  callbacks: PropTypes.object.isRequired,
  index: PropTypes.number,
  instanceId: PropTypes.symbol.isRequired,
  stylesheetCount: PropTypes.number,
  onKeyboardMove: PropTypes.func,
  onBeforeDestroy: PropTypes.func
};

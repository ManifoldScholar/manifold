import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import classNames from "classnames";
import Utility from "global/components/utility";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import PopoverMenu from "global/components/popover/Menu";
import { withTranslation } from "react-i18next";

function Stylesheet({
  stylesheet,
  text,
  callbacks,
  t,
  index,
  instanceId,
  stylesheetCount,
  onKeyboardMove
}) {
  const popoverDisclosureRef = useRef(null);

  // `element` is the whole row (draggable + drop target); `handle` is the
  // grabber icon, used as the drag handle so the nested edit link stays
  // clickable and never hijacks the drag.
  const [element, setElement] = useState(null);
  const [handle, setHandle] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState(null);

  useEffect(() => {
    if (!element) return undefined;

    const cleanups = [
      dropTargetForElements({
        element,
        canDrop: ({ source }) => source.data.instanceId === instanceId,
        getIsSticky: () => true,
        getData: ({ input }) =>
          attachClosestEdge(
            { id: stylesheet.id, index },
            { element, input, allowedEdges: ["top", "bottom"] }
          ),
        onDrag: ({ self, source }) => {
          if (source.data.id === stylesheet.id) {
            setClosestEdge(null);
            return;
          }
          setClosestEdge(extractClosestEdge(self.data));
        },
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null)
      })
    ];

    if (handle) {
      cleanups.push(
        draggable({
          element,
          dragHandle: handle,
          getInitialData: () => ({ instanceId, id: stylesheet.id, index }),
          onDragStart: () => setIsDragging(true),
          onDrop: () => setIsDragging(false)
        })
      );
    }

    return combine(...cleanups);
  }, [element, handle, stylesheet.id, index, instanceId]);

  const baseClass = "ordered-records-item";
  const editUrl = lh.link("BackendTextStylesheetEdit", text.id, stylesheet.id);
  const type = stylesheet.attributes.ingested
    ? t("texts.stylesheets.ingested")
    : t("texts.stylesheets.user_created");

  const confirmDestroy = event => {
    event.preventDefault();
    callbacks.confirmDestroy(stylesheet);
  };

  return (
    <div
      ref={setElement}
      className={classNames({
        [`${baseClass}`]: true,
        [`${baseClass}--is-dragging`]: isDragging
      })}
    >
      {closestEdge && (
        <span
          aria-hidden
          className={classNames(
            `${baseClass}__drop-indicator`,
            `${baseClass}__drop-indicator--${closestEdge}`
          )}
        />
      )}
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
                      callback: () => {
                        if (popoverDisclosureRef?.current) {
                          popoverDisclosureRef.current.focus();
                        }
                      }
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
                      callback: () => {
                        if (popoverDisclosureRef?.current) {
                          popoverDisclosureRef.current.focus();
                        }
                      }
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
  t: PropTypes.func,
  index: PropTypes.number,
  instanceId: PropTypes.symbol.isRequired,
  stylesheetCount: PropTypes.number,
  onKeyboardMove: PropTypes.func
};

export default withTranslation()(Stylesheet);

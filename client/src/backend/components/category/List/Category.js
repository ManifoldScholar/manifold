import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import Texts from "./Texts";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import Utility from "global/components/utility";
import PopoverMenu from "global/components/popover/Menu";
import classNames from "classnames";

export default function CategoryListCategory({
  project,
  category,
  activeType,
  instanceId,
  texts = [],
  callbacks,
  index,
  categoryCount,
  onTextKeyboardMove
}) {
  const { t } = useTranslation();
  const popoverDisclosureRef = useRef(null);

  // `element` is the whole category (draggable + drop target); `handle` is the
  // grabber icon, so nested links/buttons stay clickable and never hijack the drag.
  const [element, setElement] = useState(null);
  const [handle, setHandle] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState(null);

  const id = category.id;
  const title = category.attributes.title;
  const { updateCategoryPosition } = callbacks;

  useEffect(() => {
    if (!element) return undefined;

    const cleanups = [
      dropTargetForElements({
        element,
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId &&
          source.data.type === "category",
        getIsSticky: () => true,
        getData: ({ input }) =>
          attachClosestEdge(
            { type: "category", id, index },
            { element, input, allowedEdges: ["top", "bottom"] }
          ),
        onDrag: ({ self, source }) => {
          if (source.data.id === id) {
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
          getInitialData: () => ({ instanceId, type: "category", id, index }),
          onDragStart: () => setIsDragging(true),
          onDrop: () => setIsDragging(false)
        })
      );
    }

    return combine(...cleanups);
  }, [element, handle, id, index, instanceId]);

  const onDelete = event => {
    event.preventDefault();
    callbacks.destroyCategory(category);
  };

  const focusDisclosure = () => {
    if (popoverDisclosureRef?.current) popoverDisclosureRef.current.focus();
  };

  return (
    <div
      ref={setElement}
      className={classNames({
        "text-categories__category": true,
        "text-categories__category--is-dragging": isDragging
      })}
    >
      {closestEdge && (
        <span
          aria-hidden
          className={classNames(
            "text-categories__drop-indicator",
            `text-categories__drop-indicator--${closestEdge}`
          )}
        />
      )}
      <header className="text-categories__header">
        <h2 className="text-categories__label">
          <span className="text-categories__label-type--light">
            {t("glossary.category_title_case_one") + ": "}
          </span>
          {title}
        </h2>
        <div className="text-categories__utility">
          <button
            className="text-categories__button text-categories__button--notice"
            onClick={onDelete}
          >
            <Utility.IconComposer icon="delete32" size={26} />
            <span className="screen-reader-text">
              {t("projects.category.delete")}
            </span>
          </button>

          <Link
            className="text-categories__button"
            to={lh.link("backendProjectCategory", project.id, category.id)}
          >
            <Utility.IconComposer icon="annotate32" size={26} />
            <span className="screen-reader-text">
              {t("projects.category.edit")}
            </span>
          </Link>

          <div
            ref={setHandle}
            className="text-categories__button"
            tabIndex={-1}
            aria-hidden
          >
            <Utility.IconComposer icon="grabber32" size={26} />
            <span className="screen-reader-text">
              {t("projects.category.drag")}
            </span>
          </div>
          <div className="text-categories__keyboard-buttons">
            <PopoverMenu
              disclosure={
                <button
                  ref={popoverDisclosureRef}
                  className="text-categories__button"
                >
                  <Utility.IconComposer icon="arrowUpDown32" size={26} />
                  <span className="screen-reader-text">
                    {t("actions.dnd.reorder")}
                  </span>
                </button>
              }
              actions={[
                {
                  id: "up_category",
                  label: t("actions.dnd.move_up_category"),
                  // index starts with 0, positions start with 1
                  onClick: () =>
                    updateCategoryPosition(
                      category,
                      index + 1 - 1,
                      focusDisclosure,
                      true
                    ),
                  disabled: index === 0
                },
                {
                  id: "down_category",
                  label: t("actions.dnd.move_down_category"),
                  // index starts with 0, positions start with 1
                  onClick: () =>
                    updateCategoryPosition(
                      category,
                      index + 1 + 1,
                      focusDisclosure,
                      true
                    ),
                  // subtract 1 for Uncategorized, which can't move
                  disabled: index === categoryCount - 2
                }
              ]}
            />
          </div>
        </div>
      </header>
      <Texts
        category={category}
        categoryIndex={index}
        categoryCount={categoryCount}
        instanceId={instanceId}
        callbacks={callbacks}
        texts={texts}
        activeType={activeType}
        onTextKeyboardMove={onTextKeyboardMove}
      />
    </div>
  );
}

CategoryListCategory.displayName = "Category.List.Category";

CategoryListCategory.propTypes = {
  project: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  activeType: PropTypes.string,
  instanceId: PropTypes.symbol.isRequired,
  texts: PropTypes.array.isRequired,
  callbacks: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  categoryCount: PropTypes.number.isRequired,
  onTextKeyboardMove: PropTypes.func.isRequired
};

import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import Categories from "./Categories";
import Uncategorized from "./Uncategorized";
import { withTranslation } from "react-i18next";

const UNCATEGORIZED = "uncategorized";

const sortByPosition = (a, b) => a.attributes.position - b.attributes.position;

function CategoryList({ project, categories, texts, callbacks }) {
  const [instanceId] = useState(() => Symbol("categoryList"));
  const [activeType, setActiveType] = useState(null);

  const visibleTexts = texts.filter(text => !text.attributes.markedForPurgeAt);

  const categoryTexts = categoryId =>
    visibleTexts
      .filter(text =>
        categoryId === UNCATEGORIZED
          ? !text.relationships.category
          : text.relationships.category?.id === categoryId
      )
      .sort(sortByPosition);

  const stateRef = useRef();
  stateRef.current = {
    categories,
    callbacks,
    categoryTexts,
    findText: id => visibleTexts.find(tx => tx.id === id),
    findCategory: id => categories.find(c => c.id === id)
  };

  const handleCategoryDrop = (source, location) => {
    const target = location.current.dropTargets.find(
      dt => dt.data.type === "category"
    );
    if (!target) return;

    const { categories: cats, callbacks: cbs } = stateRef.current;
    const startIndex = cats.findIndex(c => c.id === source.data.id);
    const indexOfTarget = cats.findIndex(c => c.id === target.data.id);
    if (startIndex === -1 || indexOfTarget === -1) return;

    const reordered = reorderWithEdge({
      axis: "vertical",
      list: cats,
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget: extractClosestEdge(target.data)
    });
    const finalIndex = reordered.findIndex(c => c.id === source.data.id);
    if (finalIndex === startIndex) return;

    cbs.updateCategoryPosition(cats[startIndex], finalIndex + 1);
  };

  const handleTextDrop = (source, location) => {
    const targets = location.current.dropTargets;
    const rowTarget = targets.find(dt => dt.data.type === "text");
    const listTarget = targets.find(dt => dt.data.type === "text-list");
    const destinationCategoryId =
      rowTarget?.data.categoryId ?? listTarget?.data.categoryId;
    if (!destinationCategoryId) return;

    const {
      callbacks: cbs,
      categoryTexts: getTexts,
      findText,
      findCategory
    } = stateRef.current;
    const sourceCategoryId = source.data.categoryId;
    const sourceIndex = source.data.index;
    const destList = getTexts(destinationCategoryId);

    let insertIndex;
    if (rowTarget) {
      const rawIndex = destList.findIndex(tx => tx.id === rowTarget.data.id);
      if (rawIndex === -1) return;
      const edge = extractClosestEdge(rowTarget.data);
      insertIndex = edge === "bottom" ? rawIndex + 1 : rawIndex;
    } else {
      insertIndex = destList.length;
    }

    if (sourceCategoryId === destinationCategoryId) {
      if (sourceIndex < insertIndex) insertIndex -= 1;
      if (sourceIndex === insertIndex) return;
    }

    const text = findText(source.data.id);
    if (!text) return;
    const category =
      destinationCategoryId === UNCATEGORIZED
        ? undefined
        : findCategory(destinationCategoryId);

    cbs.updateTextCategoryAndPosition(text, category, insertIndex + 1);
  };

  const onDrop = ({ source, location }) => {
    setActiveType(null);
    if (source.data.type === "category") handleCategoryDrop(source, location);
    else if (source.data.type === "text") handleTextDrop(source, location);
  };
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;

  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor: ({ source }) => source.data.instanceId === instanceId,
        onDragStart: ({ source }) => setActiveType(source.data.type),
        onDrop: args => onDropRef.current(args)
      }),
      autoScrollWindowForElements()
    );
  }, [instanceId]);

  const onTextKeyboardMove = (
    { text, destinationIndex, position },
    callback
  ) => {
    const destinationIsUncategorized =
      destinationIndex === categories.length + 1;
    const destination = destinationIsUncategorized
      ? undefined
      : categories[destinationIndex];

    callbacks.updateTextCategoryAndPosition(
      text,
      destination,
      position,
      callback,
      true
    );
  };

  return (
    <section className="text-categories">
      {!!categories?.length && (
        <div
          className={classNames({
            "text-categories__dropzone": true,
            "text-categories__dropzone--active": activeType === "category"
          })}
        >
          <Categories
            instanceId={instanceId}
            activeType={activeType}
            categories={categories}
            texts={visibleTexts}
            project={project}
            callbacks={callbacks}
            onTextKeyboardMove={onTextKeyboardMove}
          />
        </div>
      )}
      <Uncategorized
        instanceId={instanceId}
        callbacks={callbacks}
        project={project}
        activeType={activeType}
        texts={categoryTexts(UNCATEGORIZED)}
        onTextKeyboardMove={onTextKeyboardMove}
        categoryCount={categories.length}
      />
    </section>
  );
}

CategoryList.displayName = "Category.List";

CategoryList.propTypes = {
  project: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  texts: PropTypes.array.isRequired,
  callbacks: PropTypes.object.isRequired
};

export default withTranslation()(CategoryList);

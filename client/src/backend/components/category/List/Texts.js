import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import classNames from "classnames";
import { useFocusAfterRemoval } from "hooks";
import TextsInner from "./TextsInner";

const UNCATEGORIZED = "uncategorized";

/* Excludes the empty-category placeholder, which is not a row. */
const TEXT_SELECTOR = ".texts-list__text:not(.texts-list__text--placeholder)";

export default function CategoryListTexts({
  activeType,
  category,
  categoryIndex,
  categoryCount,
  instanceId,
  texts = [],
  callbacks,
  onTextKeyboardMove
}) {
  const categoryId = category?.id ?? UNCATEGORIZED;
  const [element, setElement] = useState(null);

  // Neighbors are scoped to this category's texts, not the project-wide list
  // the container holds, so the hook belongs here rather than in the container.
  const { listRef, rememberRemoval } = useFocusAfterRemoval(texts, {
    itemSelector: TEXT_SELECTOR
  });

  // One stable callback ref: the drop target needs the element in state, the
  // focus hook needs it in a ref. An inline arrow would re-register the drop
  // target on every render.
  const setListElement = useCallback(
    node => {
      setElement(node);
      listRef.current = node;
    },
    [listRef]
  );

  const listCallbacks = useMemo(
    () => ({
      ...callbacks,
      // Record the neighbor only once the confirm dialog is accepted, so a
      // cancelled delete leaves no stale pending focus behind.
      destroyText: text =>
        callbacks.destroyText(text, () => rememberRemoval(text.id))
    }),
    [callbacks, rememberRemoval]
  );

  useEffect(() => {
    if (!element) return undefined;

    return dropTargetForElements({
      element,
      canDrop: ({ source }) =>
        source.data.instanceId === instanceId && source.data.type === "text",
      getData: () => ({ type: "text-list", categoryId })
    });
  }, [element, instanceId, categoryId]);

  return (
    <div
      ref={setListElement}
      tabIndex={-1}
      className={classNames({
        "texts-list": true,
        "texts-list--active": activeType === "text",
        "texts-list--empty": texts.length === 0
      })}
    >
      <TextsInner
        callbacks={listCallbacks}
        texts={texts}
        category={category}
        categoryId={categoryId}
        instanceId={instanceId}
        onTextKeyboardMove={onTextKeyboardMove}
        categoryIndex={categoryIndex}
        categoryCount={categoryCount}
      />
    </div>
  );
}

CategoryListTexts.propTypes = {
  activeType: PropTypes.string,
  category: PropTypes.object,
  texts: PropTypes.array.isRequired,
  instanceId: PropTypes.symbol.isRequired,
  callbacks: PropTypes.object.isRequired,
  onTextKeyboardMove: PropTypes.func.isRequired,
  categoryIndex: PropTypes.number.isRequired,
  categoryCount: PropTypes.number.isRequired
};

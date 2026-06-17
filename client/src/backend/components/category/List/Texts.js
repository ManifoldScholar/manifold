import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import classNames from "classnames";
import TextsInner from "./TextsInner";

const UNCATEGORIZED = "uncategorized";

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
      ref={setElement}
      className={classNames({
        "texts-list": true,
        "texts-list--active": activeType === "text",
        "texts-list--empty": texts.length === 0
      })}
    >
      <TextsInner
        callbacks={callbacks}
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

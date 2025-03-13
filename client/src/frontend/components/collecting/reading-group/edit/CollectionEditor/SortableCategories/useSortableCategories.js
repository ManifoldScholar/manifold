import { useState, useEffect, useRef } from "react";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
// import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
// import { unsafeOverflowAutoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element";

const reorder = (dropTargetData, list, startIndex, finishIndex) => {
  if (startIndex === -1 || finishIndex === -1) {
    return list;
  }
  if (startIndex === finishIndex) {
    return list;
  }

  const closestEdge = extractClosestEdge(dropTargetData);

  const reordered = reorderWithEdge({
    axis: "vertical",
    list,
    startIndex,
    indexOfTarget: finishIndex,
    closestEdgeOfTarget: closestEdge
  });

  return reordered;
};

const getTargetData = location => {
  const target = location?.current?.dropTargets?.[0];
  if (!target) return null;
  return target.data;
};

export const handleCategoryDrop = (source, location, categories) => {
  const dropTargetData = getTargetData(location);

  if (!dropTargetData || !source) return categories;

  const startIndex = categories.findIndex(c => c.id === source.data.id);
  const finishIndex = categories.findIndex(c => c.id === dropTargetData.id);

  return reorder(dropTargetData, categories, startIndex, finishIndex);
};

const handleAddCollectableToCategory = (source, dropTargetData, mappings) => {
  const currentCategory = source.data.categoryId;
  const targetCategory = dropTargetData.id;

  if (!currentCategory || !targetCategory) return mappings;

  const currentCategoryList = mappings[currentCategory][source.data.type];
  const targetCategoryList = mappings[targetCategory]
    ? [...mappings[targetCategory][source.data.type], source.data.id]
    : [source.data.id];

  return {
    ...mappings,
    [currentCategory]: {
      ...mappings[currentCategory],
      [source.data.type]: currentCategoryList.filter(c => c !== source.data.id)
    },
    [targetCategory]: {
      ...mappings[targetCategory],
      [source.data.type]: targetCategoryList
    }
  };
};

const handleCollectableDrop = (source, location, mappings) => {
  const dropTargetData = getTargetData(location);

  if (!dropTargetData || !source) return mappings;

  if (dropTargetData.category)
    return handleAddCollectableToCategory(source, dropTargetData, mappings);

  const currentCategory = source.data.categoryId;
  const targetCategory = dropTargetData.categoryId;

  if (!currentCategory || !targetCategory) return mappings;

  if (currentCategory === targetCategory) {
    const list = mappings[currentCategory][source.data.type];

    return {
      ...mappings,
      [currentCategory]: {
        ...mappings[currentCategory],
        [source.data.type]: reorder(
          dropTargetData,
          list,
          source.data.index,
          dropTargetData.index
        )
      }
    };
  }

  const currentCategoryList = mappings[currentCategory][source.data.type];
  const targetCategoryList = mappings[targetCategory]
    ? [...mappings[targetCategory][source.data.type], source.data.id]
    : [source.data.id];

  return {
    ...mappings,
    [currentCategory]: {
      ...mappings[currentCategory],
      [source.data.type]: currentCategoryList.filter(c => c !== source.data.id)
    },
    [targetCategory]: {
      ...mappings[targetCategory],
      [source.data.type]: reorder(
        dropTargetData,
        targetCategoryList,
        targetCategoryList.length - 1,
        dropTargetData.index
      )
    }
  };
};

export default function useSortableCategories(
  categories,
  onCategoryDrop,
  mappings,
  onCollectableDrop
) {
  const [active, setActive] = useState(null);

  const scrollableRef = useRef(null);

  useEffect(() => {
    if (scrollableRef.current) {
      const scrollContainer = scrollableRef.current;
      invariant(scrollContainer);

      return combine(
        monitorForElements({
          onDragStart({ source }) {
            if (source?.data?.type === "categories") {
              setActive(true);
              scrollTo(0, 650);
            }
          },
          onDrop({ source, location }) {
            if (source?.data?.type === "categories") {
              setActive(false);
              const result = handleCategoryDrop(source, location, categories);
              onCategoryDrop(result, source.data.id);
            } else {
              const result = handleCollectableDrop(source, location, mappings);
              onCollectableDrop(result, source);
            }
          }
        })
        // autoScrollForElements({
        //   canScroll({ source }) {
        //     return !!source?.type === "categories";
        //   },
        //   getConfiguration: () => ({ maxScrollSpeed: "standard" }),
        //   element: scrollContainer
        // })
        // unsafeOverflowAutoScrollForElements({
        //   element: scrollContainer,
        //   getConfiguration: () => ({ maxScrollSpeed: "standard" }),
        //   canScroll({ source }) {
        //     return !!source?.type === "categories";
        //   },
        //   getOverflow() {
        //     return {
        //       forLeftEdge: {
        //         top: 1000,
        //         left: 1000,
        //         bottom: 1000
        //       },
        //       forRightEdge: {
        //         top: 1000,
        //         right: 1000,
        //         bottom: 1000
        //       }
        //     };
        //   }
        // })
      );
    }
  }, [categories, onCategoryDrop, scrollableRef, mappings, onCollectableDrop]);

  return { scrollableRef, active };
}

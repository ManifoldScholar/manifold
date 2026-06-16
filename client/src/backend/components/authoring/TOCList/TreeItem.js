import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import {
  draggable,
  dropTargetForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachInstruction,
  extractInstruction
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
import Entry from "./TOCEntry";
import DropIndicator from "./DropIndicator";
import { useTreeContext } from "./TreeContext";
import { isDescendant, getRowsForChildren } from "./treeHelpers";
import * as Styled from "./styles";

const getDropMode = (isExpanded, isLastInGroup) => {
  if (isExpanded) return "expanded";
  if (isLastInGroup) return "last-in-group";
  return "standard";
};

export default function TreeItem({
  item,
  level,
  isLastInGroup,
  positionInSet,
  canNest,
  canUnnest
}) {
  const { t } = useTranslation();
  const {
    uniqueContextId,
    indentPerLevel,
    getTree,
    onToggle,
    onDelete,
    onKeyboardMove,
    textId
  } = useTreeContext();

  const rowRef = useRef(null);
  const dragHandleRef = useRef(null);
  const disclosureRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [instruction, setInstruction] = useState(null);

  const { id } = item;
  const { title } = item.data ?? {};
  const isExpanded = item.hasChildren && item.isExpanded;

  useEffect(() => {
    const element = rowRef.current;
    const dragHandle = dragHandleRef.current;
    invariant(element && dragHandle);

    return draggable({
      element,
      dragHandle,
      getInitialData: () => ({ uniqueContextId, id, title, level }),
      onDragStart: () => setDragging(true),
      onDrop: () => {
        setDragging(false);
      }
    });
  }, [id, title, level, uniqueContextId]);

  useEffect(() => {
    const element = rowRef.current;
    invariant(element);

    const mode = getDropMode(isExpanded, isLastInGroup);

    return dropTargetForElements({
      element,
      getData: ({ input }) =>
        attachInstruction(
          { id },
          {
            element,
            input,
            currentLevel: level,
            indentPerLevel,
            mode,
            block: item.data?.isValidParent ? [] : ["make-child"]
          }
        ),
      canDrop: ({ source }) => {
        if (source.data.uniqueContextId !== uniqueContextId) return false;
        if (source.data.id === id) return false;
        return !isDescendant(getTree().items, source.data.id, id);
      },
      onDrag: ({ self, source }) => {
        if (source.data.id === id) {
          setInstruction(null);
          return;
        }
        setInstruction(extractInstruction(self.data));
      },
      onDragLeave: () => setInstruction(null),
      onDrop: () => setInstruction(null)
    });
  }, [
    id,
    level,
    isExpanded,
    isLastInGroup,
    indentPerLevel,
    uniqueContextId,
    getTree,
    item.data
  ]);

  const isBlocked = instruction?.type === "instruction-blocked";
  const isParentTarget = instruction?.type === "make-child" || isBlocked;

  const moveActions = [
    {
      id: "up",
      label: t("actions.dnd.move_up_position"),
      onClick: () => onKeyboardMove(id, "up"),
      disabled: positionInSet === 1
    },
    {
      id: "down",
      label: t("actions.dnd.move_down_position"),
      onClick: () => onKeyboardMove(id, "down"),
      disabled: isLastInGroup
    },
    {
      id: "nest",
      label: t("texts.toc.menu_nest"),
      onClick: () => onKeyboardMove(id, "indent"),
      disabled: !canNest
    },
    {
      id: "unnest",
      label: t("texts.toc.menu_unnest"),
      onClick: () => onKeyboardMove(id, "outdent"),
      disabled: !canUnnest
    }
  ];

  const childRows = isExpanded
    ? getRowsForChildren(getTree().items, item.children, level + 1)
    : [];

  return (
    <Styled.Item>
      {/* The draggable + drop target is the row only — NOT the <li>, so a
          parent's hitbox never encloses its nested children's hitboxes. */}
      <Styled.Row ref={rowRef} data-toc-row>
        <Entry
          entry={item}
          depth={level}
          dragHandleRef={dragHandleRef}
          disclosureRef={disclosureRef}
          moveActions={moveActions}
          isDragging={dragging}
          isTarget={isParentTarget}
          targetBlocked={isBlocked}
          textId={textId}
          onDelete={onDelete}
          onToggle={onToggle}
        />
        <DropIndicator
          instruction={instruction}
          indentPerLevel={indentPerLevel}
        />
      </Styled.Row>
      {childRows.length > 0 && (
        <Styled.Group>
          {childRows.map(row => (
            <TreeItem
              key={row.id}
              item={getTree().items[row.id]}
              level={row.level}
              positionInSet={row.positionInSet}
              isLastInGroup={row.isLastInGroup}
              canNest={row.canNest}
              canUnnest={row.canUnnest}
            />
          ))}
        </Styled.Group>
      )}
    </Styled.Item>
  );
}

TreeItem.displayName = "Text.TOC.List.TreeItem";

TreeItem.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  isLastInGroup: PropTypes.bool,
  positionInSet: PropTypes.number,
  canNest: PropTypes.bool,
  canUnnest: PropTypes.bool
};

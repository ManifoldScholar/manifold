import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { extractInstruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
import { announce } from "@atlaskit/pragmatic-drag-and-drop-live-region";
import TreeItem from "./TreeItem";
import { TreeContext } from "./TreeContext";
import {
  INDENT_PER_LEVEL,
  getRowsForChildren,
  formatTOCData,
  formatTreeData,
  getNestedTreeChildren,
  keyboardMove,
  moveItemInTree,
  mutateTreeItem,
  removeKeys
} from "./treeHelpers";
import { textsAPI } from "api";
import { useApiCallback } from "hooks";
import * as Styled from "./styles";

// Distinguishes this list's drags from any other pragmatic-dnd surface on the page.
const uniqueContextId = Symbol("toc-tree");

export default function TOCList({ tree, setTree, textId, error, setError }) {
  const { t } = useTranslation();

  const [dragging, setDragging] = useState(false);

  const scrollableRef = useRef(null);

  // Keep the latest tree available to dnd callbacks without re-binding effects.
  const treeRef = useRef(tree);
  treeRef.current = tree;

  const updateText = useApiCallback(textsAPI.update);

  const persist = useCallback(
    async newTree => {
      setError(null);
      const res = await updateText(textId, {
        attributes: { toc: formatTOCData(newTree) }
      });
      if (res?.errors) setError("reorder");
    },
    [textId, updateText, setError]
  );

  const commit = useCallback(
    newTree => {
      if (!newTree || newTree === treeRef.current) return;
      setTree(newTree);
      persist(newTree);
    },
    [setTree, persist]
  );

  const onToggle = useCallback(
    (id, isExpanded) => {
      setTree(mutateTreeItem(treeRef.current, id, { isExpanded }));
    },
    [setTree]
  );

  const onDelete = useCallback(
    async entryId => {
      setError(null);
      const current = treeRef.current;
      const toDelete = [
        entryId,
        ...getNestedTreeChildren(entryId, current.items)
      ];
      const update = removeKeys(toDelete, current.items);
      const newToc = formatTOCData({ ...current, items: update });

      const res = await updateText(textId, { attributes: { toc: newToc } });
      if (res?.errors) return setError(res.errors);
      setTree(formatTreeData(newToc));
    },
    [textId, updateText, setError, setTree]
  );

  const onKeyboardMove = useCallback(
    (id, action) => {
      const result = keyboardMove(treeRef.current, id, action);
      if (!result || result.tree === treeRef.current) return;
      commit(result.tree);
      announce(t(`texts.toc.${result.announce}`, result.params));
      // Rows reorder/re-render; return focus to this row's move-menu button so
      // keyboard users can chain moves (matches SectionsList).
      requestAnimationFrame(() => {
        const toggle = document.querySelector(
          `[data-disclosure-toggle-for="${id}"]`
        );
        if (toggle) toggle.focus();
      });
    },
    [commit, t]
  );

  const getTree = useCallback(() => treeRef.current, []);

  useEffect(() => {
    const element = scrollableRef.current;
    invariant(element);

    return combine(
      monitorForElements({
        canMonitor: ({ source }) =>
          source.data.uniqueContextId === uniqueContextId,
        onDragStart: () => setDragging(true),
        onDrop({ source, location }) {
          setDragging(false);
          const target = location.current.dropTargets[0];
          if (!target) return;
          const instruction = extractInstruction(target.data);
          if (!instruction || instruction.type === "instruction-blocked")
            return;

          const update = moveItemInTree(treeRef.current, {
            itemId: source.data.id,
            targetId: target.data.id,
            instruction
          });
          if (update !== treeRef.current) {
            commit(update);
            announce(
              t("texts.toc.announce_dropped", { title: source.data.title })
            );
          }
        }
      }),
      autoScrollWindowForElements()
    );
  }, [commit, t]);

  /* eslint-disable no-nested-ternary */
  const errorMessage =
    error === "reorder"
      ? t("errors.toc_reorder")
      : Array.isArray(error)
      ? error.map(e => e.detail).join(". ")
      : error;
  /* eslint-enable no-nested-ternary */

  if (!tree) return null;

  const rows = getRowsForChildren(tree.items, tree.items.root.children, 0);

  const contextValue = {
    uniqueContextId,
    indentPerLevel: INDENT_PER_LEVEL,
    getTree,
    onToggle,
    onDelete,
    onKeyboardMove,
    textId
  };

  return (
    <TreeContext.Provider value={contextValue}>
      <Styled.Wrapper className="full-width" $dragging={dragging}>
        {error && <Styled.Error>{errorMessage}</Styled.Error>}
        <Styled.ScrollContainer ref={scrollableRef}>
          <Styled.List aria-label={t("texts.toc_header")}>
            {rows.map(row => (
              <TreeItem
                key={row.id}
                item={tree.items[row.id]}
                level={row.level}
                isLastInGroup={row.isLastInGroup}
                positionInSet={row.positionInSet}
                canNest={row.canNest}
                canUnnest={row.canUnnest}
              />
            ))}
          </Styled.List>
        </Styled.ScrollContainer>
      </Styled.Wrapper>
    </TreeContext.Provider>
  );
}

TOCList.displayName = "Text.TOC.List";

TOCList.propTypes = {
  tree: PropTypes.object.isRequired,
  setTree: PropTypes.func.isRequired,
  textId: PropTypes.string.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  setError: PropTypes.func.isRequired
};

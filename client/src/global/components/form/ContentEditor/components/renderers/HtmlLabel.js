import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { rteElements, inlineNodes, markElements } from "../../utils/elements";
import { formatNodeLabel } from "../../utils/slate/general";
import { removeNode } from "../../utils/slate/transforms/removeNode";
import { unwrapNode } from "../../utils/slate/transforms";
import IconComposer from "global/components/utility/IconComposer";
import debounce from "lodash/debounce";
import { useSlateStatic, ReactEditor } from "slate-react";
import { Transforms, Editor } from "slate";
import { useHtmlBreadcrumbs } from "../../contexts/htmlBreadcrumbsContext";
import * as Styled from "./styles";

export default function HtmlLabel({ visible, element }) {
  const editor = useSlateStatic();
  const inputRef = useRef(null);

  const { t } = useTranslation();

  const { editingCrumb: editing } = useHtmlBreadcrumbs();

  useEffect(() => {
    if (inputRef.current && editing) inputRef.current.focus();
  }, [editing]);

  if (!visible) return null;

  /* eslint-disable no-nested-ternary */
  const color = rteElements.includes(element.type)
    ? "green"
    : inlineNodes.includes(element.type) || markElements.includes(element.type)
    ? "blue"
    : "violet";

  const path = !markElements.includes(element.type)
    ? ReactEditor.findPath(editor, element)
    : [];

  const disableDelete =
    path.length === 1 ||
    (element.type === "li" && !Editor.isEmpty(editor, element));

  const disableLift = path.length <= 2 || element.type === "li";

  const updateClassName = e => {
    e.persist();
    const doUpdate = debounce(() => {
      Transforms.setNodes(
        editor,
        {
          ...element,
          htmlAttrs: {
            ...element.htmlAttrs,
            class: e.target.value.replaceAll(".", " ").trim()
          }
        },
        { at: path, mode: "highest" }
      );
    }, 1000);
    doUpdate(e);
  };

  const handleDelete = e => {
    e.preventDefault();
    removeNode(editor, path);
  };

  const tagAndId = element.htmlAttrs?.id
    ? `${element.type}#${element.htmlAttrs.id}`
    : element.type;
  const formattedClass = element.htmlAttrs?.class?.trim().replaceAll(" ", ".");

  return editing ? (
    <Styled.EditableElementLabel contentEditable={false} $color={color}>
      <span>{tagAndId}.</span>
      <Styled.ClassInput
        ref={inputRef}
        defaultValue={formattedClass}
        onChange={e => updateClassName(e)}
      />
      <Styled.TagButtons>
        <Styled.LiftButton
          onClick={e => {
            e.preventDefault();
            unwrapNode({ editor, format: element.type, path });
          }}
          aria-label={t("editor.controls.labels.lift")}
          disabled={disableLift}
        >
          <IconComposer icon="arrowUp16" size={16} />
        </Styled.LiftButton>
        <Styled.DeleteButton
          onClick={handleDelete}
          aria-label={t("actions.delete")}
          disabled={disableDelete}
        >
          <IconComposer icon="delete24" size={16} />
        </Styled.DeleteButton>
      </Styled.TagButtons>
    </Styled.EditableElementLabel>
  ) : (
    <Styled.ElementLabel $color={color}>
      {formatNodeLabel(element)}
    </Styled.ElementLabel>
  );
}

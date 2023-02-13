import React, { useState, useCallback, useMemo } from "react";
import { createEditor, Transforms, Path, Editor as SlateEditor } from "slate";
import { Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { Leaf, Element } from "./renderers";
import { MarkButton, BlockButton, ToggleHTML } from "./controls";
import { serializeToHtml, serializeToSlate } from "./serializers";
import { HTMLEditor } from "./loaders";
import { withVoids } from "./plugins";
import { clearSlate, formatHtml } from "./slateHelpers";
import * as Styled from "./styles";

export default function Editor({
  set: setFormValue,
  initialSlateValue,
  initialHtmlValue,
  stylesheets
}) {
  const editor = useMemo(
    () => withHistory(withReact(withVoids(createEditor()))),
    []
  );
  const [htmlMode, toggleHtmlMode] = useState(false);
  const [localHtml, setLocalHtml] = useState(initialHtmlValue);
  const [localSlate, setLocalSlate] = useState(initialSlateValue);
  const theme = stylesheets?.map(s => s.attributes.styles).join("\n");

  const renderElement = useCallback(props => <Element {...props} />, []);

  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  const onChangeSlate = val => {
    setLocalSlate(val);
    setFormValue(val);
  };

  const onChangeHtml = val => {
    setLocalHtml(val);
    setFormValue(val);
  };

  const toggleEditorView = () => {
    if (htmlMode) {
      const json = serializeToSlate(localHtml);
      setLocalSlate(json);
      clearSlate(editor);
      Transforms.insertNodes(editor, json);
      return toggleHtmlMode(false);
    }

    const html = formatHtml(serializeToHtml(localSlate));
    setLocalHtml(html);
    return toggleHtmlMode(true);
  };

  const onClickHtml = e => {
    e.stopPropagation();
    e.preventDefault();
    toggleEditorView();
  };

  const codeAreaProps = {
    onChange: onChangeHtml,
    value: localHtml
  };

  const onKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      // handle case where prev is a span or other inline
      const prev = SlateEditor.above(editor, editor.selection);
      const focusOffset = editor.selection.focus.offset;
      const endOffset = SlateEditor.end(editor, prev[1]).offset;

      if (focusOffset !== endOffset) {
        Transforms.splitNodes(editor, { at: editor.selection });
      } else {
        const { children, htmlAttrs, ...next } = prev[0];
        const path = Path.next(prev[1]);
        Transforms.insertNodes(
          editor,
          { ...next, children: [] },
          { at: editor.selection }
        );
        Transforms.select(editor, {
          anchor: { path: [...path, 0], offset: 0 },
          focus: { path: [...path, 0], offset: 0 }
        });
      }
    }
  };

  return (
    <Styled.EditorSecondary>
      <Slate editor={editor} value={localSlate} onChange={onChangeSlate}>
        <Styled.Toolbar>
          <MarkButton icon="bold16" format="bold" />
          <MarkButton icon="italic16" format="italic" />
          <MarkButton icon="underline16" format="underline" />
          <BlockButton icon="headingOne16" format="h1" />
          <BlockButton icon="headingTwo16" format="h2" />
          <BlockButton icon="orderedList16" format="ol" />
          <BlockButton icon="unorderedList16" format="ul" />
          <BlockButton icon="blockQuote16" format="blockquote" />
          <ToggleHTML icon="code16" active={htmlMode} onClick={onClickHtml} />
        </Styled.Toolbar>
        <Styled.EditableWrapper className="manifold-text-section">
          {!htmlMode && (
            <Styled.Editable
              as="div"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Enter text here..."
              spellCheck={false}
              onKeyDown={onKeyDown}
            />
          )}
          {htmlMode && <HTMLEditor {...codeAreaProps} />}
        </Styled.EditableWrapper>
        {theme && (
          <style
            dangerouslySetInnerHTML={{
              __html: theme
            }}
          />
        )}
      </Slate>
    </Styled.EditorSecondary>
  );
}

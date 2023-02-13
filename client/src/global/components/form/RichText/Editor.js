import React, { useState, useCallback, useMemo } from "react";
import { createEditor, Transforms } from "slate";
import { Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { Leaf, Element } from "./renderers";
import { MarkButton, BlockButton, ToggleHTML } from "./controls";
import { serializeToHtml, serializeToSlate } from "./serializers";
import { HTMLEditor } from "./loaders";
import { clearSlate, formatHtml } from "./slateHelpers";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function Editor({
  set: setFormValue,
  initialSlateValue,
  initialHtmlValue
}) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [htmlMode, toggleHtmlMode] = useState(false);
  const [localHtml, setLocalHtml] = useState(initialHtmlValue);
  const [localSlate, setLocalSlate] = useState(initialSlateValue);
  const settings = useFromStore("settings", "select");
  const theme = `.rte-container {${settings.attributes.ingestion.globalStyles}}`;

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
      console.log(editor.children);
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

  return (
    <Styled.EditorSecondary className="rte-container">
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
        <Styled.EditableWrapper>
          {!htmlMode && (
            <Styled.Editable
              as="div"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Enter text here..."
              spellCheck={false}
            />
          )}
          {htmlMode && <HTMLEditor {...codeAreaProps} />}
        </Styled.EditableWrapper>
        <style>{theme}</style>
      </Slate>
    </Styled.EditorSecondary>
  );
}

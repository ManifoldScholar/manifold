import React, { useState, useCallback } from "react";
import { createEditor, Transforms } from "slate";
import { Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { Leaf, Element } from "./renderers";
import { MarkButton, BlockButton, ToggleHTML } from "./controls";
import { serializeToHtml, serializeToSlate } from "./serializers";
import { HTMLEditor } from "./loaders";
import { clearSlate } from "./slateHelpers";
import * as Styled from "./styles";

const defaultValue = [
  {
    type: "p",
    children: [{ text: "" }]
  }
];

const getInitialValue = value => {
  if (!value) return defaultValue;
  if (typeof value === "string") return serializeToSlate(value);
  return value;
};

export default function Editor({ set: setFormValue, value }) {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [htmlMode, toggleHtmlMode] = useState(true);
  const [localHtml, setLocalHtml] = useState(value);
  const [localSlate, setLocalSlate] = useState(getInitialValue());

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

    const html = serializeToHtml(localSlate);
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
        <Styled.EditableWrapper>
          {!htmlMode && (
            <Styled.Editable
              as="div"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Enter text here..."
              spellCheck
            />
          )}
          {htmlMode && <HTMLEditor {...codeAreaProps} />}
        </Styled.EditableWrapper>
      </Slate>
    </Styled.EditorSecondary>
  );
}

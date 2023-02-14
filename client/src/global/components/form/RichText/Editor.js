import React, { useState, useCallback } from "react";
import { createEditor, Transforms, Node } from "slate";
import { Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { Leaf, Element } from "./renderers";
import { MarkButton, BlockButton, ToggleHTML } from "./controls";
import { serializeToHtml, serializeToSlate } from "./serializers";
import { parseDocument } from "htmlparser2";
import serializer from "dom-serializer";
import * as Styled from "./styles";

const defaultValue = [
  {
    type: "p",
    children: [{ text: "" }]
  }
];

export default function Editor({ set, value }) {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [htmlMode, toggleHtmlMode] = useState(false);

  const renderElement = useCallback(props => <Element {...props} />, []);

  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  const onChange = val => {
    console.log(val);
  };

  const toggleEditorView = () => {
    if (htmlMode) {
      const toString = nodes => nodes.map(n => Node.string(n)).join("");
      const currentVal = toString(editor.children);
      const json = serializeToSlate(currentVal);
      Transforms.removeNodes(editor, { at: [0] });
      Transforms.insertNodes(editor, json);
      return toggleHtmlMode(false);
    }
    const currentVal = editor.children;
    const html = serializeToHtml(currentVal);

    const count = Array(editor.children.length).keys();
    [...count].forEach(() => {
      try {
        Transforms.removeNodes(editor, { at: [0] });
      } catch (e) {
        console.log(e);
      }
    });

    const toChildren = content => [{ text: content }];
    const toCodeLines = content => {
      const nodes = parseDocument(content).children;
      return nodes.map(node => ({
        type: "code-line",
        children: toChildren(serializer(node))
      }));
    };

    const htmlValue = [
      {
        type: "html",
        children: toCodeLines(html)
      }
    ];
    Transforms.insertNodes(editor, htmlValue, {
      at: [editor.children.length]
    });
    toggleHtmlMode(true);
  };

  const onClickHtml = e => {
    e.stopPropagation();
    e.preventDefault();
    toggleEditorView();
  };

  const initialValue = value ? serializeToSlate(value) : defaultValue;

  return (
    <Styled.EditorSecondary>
      <Slate editor={editor} value={initialValue} onChange={onChange}>
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
        <Styled.Editable
          as="div"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter text here..."
          spellCheck
        />
      </Slate>
    </Styled.EditorSecondary>
  );
}

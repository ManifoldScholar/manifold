import React, { useState, useCallback } from "react";
import { createEditor } from "slate";
import { Slate, withReact } from "slate-react";
// import { withHistory } from "slate-history";
import { Leaf, Element } from "./renderers";
import { MarkButton, BlockButton } from "./controls";
import { serializeToHtml, serializeToSlate } from "./serializers";
import * as Styled from "./styles";

const defaultValue = [
  {
    type: "paragraph",
    children: [{ text: "" }]
  }
];

export default function Editor({ set, value }) {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback(props => <Element {...props} />, []);

  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  const onChange = val => {
    const html = serializeToHtml(val);
    if (set) set(html);
  };

  const initialValue = value ? serializeToSlate(value) : defaultValue;

  return (
    <Styled.EditorSecondary>
      <Slate editor={editor} value={initialValue} onChange={onChange}>
        <Styled.Toolbar>
          <MarkButton icon="bold16" format="bold" />
          <MarkButton icon="italic16" format="italic" />
          <MarkButton icon="underline16" format="underline" />
          <BlockButton icon="unorderedList16" format="ul" />
        </Styled.Toolbar>
        <Styled.Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter text here..."
          spellCheck
        />
      </Slate>
    </Styled.EditorSecondary>
  );
}

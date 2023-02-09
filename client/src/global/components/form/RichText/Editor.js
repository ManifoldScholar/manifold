import React, { useState, useCallback } from "react";
import { createEditor } from "slate";
import { Slate, withReact } from "slate-react";
// import { withHistory } from "slate-history";
import { Leaf, Element } from "./renderers";
import { MarkButton, BlockButton } from "./controls";
import * as Styled from "./styles";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }]
  }
];

export default function Editor() {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback(props => <Element {...props} />, []);

  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  const onChange = val => console.log(val);

  return (
    <Styled.EditorSecondary>
      <Slate editor={editor} value={initialValue} onChange={onChange}>
        <Styled.Toolbar>
          <MarkButton icon="bold16" format="bold" />
          <MarkButton icon="italic16" format="italic" />
          <MarkButton icon="underline16" format="underline" />
          <BlockButton icon="unorderedList16" format="ul-list" />
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

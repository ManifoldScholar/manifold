import React, { forwardRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { Transforms } from "slate";
import { toggleBlock, isBlockActive } from "./BlockButton";
import * as Styled from "./styles";

const getActiveBlock = editor => {
  const h1 = isBlockActive(editor, "h1");
  const h2 = isBlockActive(editor, "h2");
  const h3 = isBlockActive(editor, "h3");
  const p = isBlockActive(editor, "p");

  const activeCount = [p, h1, h2, h3].filter(Boolean).length;

  if (activeCount > 1) return "";
  if (h1) return "h1";
  if (h2) return "h2";
  if (h3) return "h3";
  return "p";
};

const BlockSelect = ({ options, selection, ...rest }, ref) => {
  const editor = useSlate();

  const renderOptions = options.map(o => (
    <option key={o.format} value={o.format}>
      {o.label}
    </option>
  ));

  return (
    <Styled.SelectWrapper>
      <Styled.Select
        ref={ref}
        {...rest}
        aria-label="Text styles"
        value={getActiveBlock(editor)}
        onChange={e => {
          e.preventDefault();
          Transforms.select(editor, selection);
          toggleBlock(editor, e.target.value);
          ReactEditor.focus(editor);
        }}
        tabIndex={-1}
      >
        {renderOptions}
      </Styled.Select>
      <Styled.SelectIcon icon="disclosureDown24" size={16} />
    </Styled.SelectWrapper>
  );
};

export default forwardRef(BlockSelect);
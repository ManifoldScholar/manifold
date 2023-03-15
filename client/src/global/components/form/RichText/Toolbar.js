import React from "react";
import {
  MarkButton,
  BlockButton,
  ToggleHTML,
  LinkButton,
  ImageButton,
  IframeButton
} from "./controls";
import * as Styled from "./styles";

export default function Toolbar({ selection, htmlMode, onClickToggle }) {
  return (
    <Styled.Toolbar>
      <MarkButton icon="bold16" format="bold" selection={selection} />
      <MarkButton icon="italic16" format="italic" selection={selection} />
      <MarkButton icon="underline16" format="underline" selection={selection} />
      <MarkButton
        icon="strikethrough16"
        format="strikethrough"
        selection={selection}
      />
      <LinkButton icon="resourceLink64" size={20} selection={selection} />
      <BlockButton icon="headingOne16" format="h1" selection={selection} />
      <BlockButton icon="headingTwo16" format="h2" selection={selection} />
      <BlockButton icon="headingThree16" format="h3" selection={selection} />
      <BlockButton icon="orderedList16" format="ol" selection={selection} />
      <BlockButton icon="unorderedList16" format="ul" selection={selection} />
      <BlockButton
        icon="blockQuote16"
        format="blockquote"
        selection={selection}
      />
      <ImageButton icon="resourceImage64" size={20} selection={selection} />
      <IframeButton icon="resourceVideo64" size={20} selection={selection} />
      <ToggleHTML icon="code16" active={htmlMode} onClick={onClickToggle} />
    </Styled.Toolbar>
  );
}

import React from "react";
import {
  MarkButton,
  BlockButton,
  LinkButton,
  ImageButton,
  IframeButton
} from "./buttons";
import {
  MenuBar as ReakitMenuBar,
  MenuItem as ReakitMenuItem,
  useMenuBarState
} from "reakit/Menu";
import * as Styled from "./styles";

export default function Toolbar({ selection }) {
  const menu = useMenuBarState({
    orientation: "horizontal",
    loop: true,
    wrap: "horizontal"
  });
  return (
    <Styled.Toolbar aria-label="Rich text toolbar">
      <ReakitMenuBar {...menu}>
        <ReakitMenuItem
          as={MarkButton}
          icon="bold16"
          format="bold"
          selection={selection}
          isFirst
          {...menu}
        />
        <ReakitMenuItem
          as={MarkButton}
          icon="italic16"
          format="italic"
          selection={selection}
          {...menu}
        />
        <ReakitMenuItem
          as={MarkButton}
          icon="underline16"
          format="underline"
          selection={selection}
          {...menu}
        />
        <ReakitMenuItem
          as={MarkButton}
          icon="strikethrough16"
          format="strikethrough"
          selection={selection}
          {...menu}
        />
        <ReakitMenuItem
          as={LinkButton}
          icon="resourceLink64"
          size={20}
          selection={selection}
          {...menu}
        />
        <ReakitMenuItem
          as={BlockButton}
          icon="headingOne16"
          format="h1"
          selection={selection}
          {...menu}
        />
        <ReakitMenuItem
          as={BlockButton}
          icon="headingTwo16"
          format="h2"
          selection={selection}
          {...menu}
        />
        <ReakitMenuItem
          as={BlockButton}
          icon="headingThree16"
          format="h3"
          selection={selection}
          {...menu}
        />
        <ReakitMenuItem
          as={BlockButton}
          icon="orderedList16"
          format="ol"
          selection={selection}
          {...menu}
        />
        <ReakitMenuItem
          as={BlockButton}
          icon="unorderedList16"
          format="ul"
          selection={selection}
          {...menu}
        />
        <ReakitMenuItem
          as={BlockButton}
          icon="blockQuote16"
          format="blockquote"
          selection={selection}
          {...menu}
        />
        <ReakitMenuItem
          as={ImageButton}
          icon="resourceImage64"
          size={20}
          selection={selection}
          {...menu}
        />
        <ReakitMenuItem
          as={IframeButton}
          icon="resourceVideo64"
          size={20}
          selection={selection}
          {...menu}
        />
      </ReakitMenuBar>
    </Styled.Toolbar>
  );
}

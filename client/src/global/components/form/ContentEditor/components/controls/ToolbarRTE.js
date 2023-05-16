import React from "react";
import {
  MarkButton,
  BlockButton,
  LinkButton,
  ImageButton,
  IframeButton,
  BlockSelect,
  FunctionButton
} from "./buttons";
import {
  MenuBar as ReakitMenuBar,
  MenuItem as ReakitMenuItem,
  useMenuBarState
} from "reakit/Menu";
import * as Styled from "./styles";

export default function ToolbarRTE({ onClickUndo, onClickRedo }) {
  const menu = useMenuBarState({
    orientation: "horizontal",
    loop: true,
    wrap: "horizontal"
  });

  return (
    <ReakitMenuBar as={Styled.Toolbar} aria-label="Rich text toolbar" {...menu}>
      <Styled.ToolGroup>
        <ReakitMenuItem
          as={FunctionButton}
          icon="undo24"
          onClick={onClickUndo}
          tooltip="undo"
          isFirst
          {...menu}
        />
        <ReakitMenuItem
          as={FunctionButton}
          icon="redo24"
          onClick={onClickRedo}
          tooltip="redo"
          {...menu}
        />
        <Styled.ToolbarSpacer />
      </Styled.ToolGroup>
      <Styled.ToolGroup>
        <ReakitMenuItem
          as={BlockSelect}
          options={[
            { format: "p", label: "Normal Text" },
            { format: "h1", label: "Heading 1" },
            { format: "h2", label: "Heading 2" },
            { format: "h3", label: "Heading 3" },
            { format: "h4", label: "Heading 4" },
            { format: "", label: "" }
          ]}
          {...menu}
        />
        <Styled.ToolbarSpacer />
      </Styled.ToolGroup>
      <Styled.ToolGroup>
        <ReakitMenuItem as={MarkButton} icon="bold24" format="bold" {...menu} />
        <ReakitMenuItem
          as={MarkButton}
          icon="italic24"
          format="italic"
          {...menu}
        />
        <ReakitMenuItem
          as={MarkButton}
          icon="underline24"
          format="underline"
          {...menu}
        />
        <ReakitMenuItem
          as={MarkButton}
          icon="strikethrough24"
          format="strikethrough"
          {...menu}
        />
        <ReakitMenuItem as={MarkButton} icon="code24" format="code" {...menu} />
        <Styled.ToolbarSpacer />
      </Styled.ToolGroup>
      <Styled.ToolGroup>
        <ReakitMenuItem
          as={BlockButton}
          icon="orderedList24"
          format="ol"
          {...menu}
        />
        <ReakitMenuItem
          as={BlockButton}
          icon="unorderedList24"
          format="ul"
          {...menu}
        />
        <ReakitMenuItem
          as={BlockButton}
          icon="blockQuote24"
          format="blockquote"
          {...menu}
        />
        <ReakitMenuItem
          as={BlockButton}
          icon="codeBlock24"
          format="pre"
          {...menu}
        />
        <Styled.ToolbarSpacer />
      </Styled.ToolGroup>
      <Styled.ToolGroup>
        <ReakitMenuItem as={LinkButton} icon="RTELink24" {...menu} />
        <ReakitMenuItem as={ImageButton} icon="RTEImage24" {...menu} />
        <ReakitMenuItem as={IframeButton} icon="iframe24" {...menu} />
      </Styled.ToolGroup>
    </ReakitMenuBar>
  );
}

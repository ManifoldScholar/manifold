import React, { useContext, Fragment, useCallback } from "react";
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
import { Node } from "slate";
import { useSlateStatic, useSlateSelection } from "slate-react";
import { getAncestors } from "../../utils/slate";
import { HtmlBreadcrumbsContext } from "../../index";
import { rteElements, inlineNodes } from "../../utils/elements";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function ToolbarRTE({ onClickUndo, onClickRedo, darkMode }) {
  const menu = useMenuBarState({
    orientation: "horizontal",
    loop: true,
    wrap: "horizontal"
  });

  const editor = useSlateStatic();
  const selection = useSlateSelection();
  const path = selection?.anchor?.path;

  let ancestors = {};
  if (path) {
    const iterator = Node.ancestors(editor, selection?.anchor.path);
    ancestors = getAncestors(editor, iterator);
  }

  const { setSelectedCrumb, selectedCrumb } = useContext(
    HtmlBreadcrumbsContext
  );

  const onToggleHtmlOutlines = useCallback(
    e => {
      e.preventDefault();

      const val = selectedCrumb === "all" ? null : "all";
      setSelectedCrumb(val);
    },
    [selectedCrumb, setSelectedCrumb]
  );

  return (
    <>
      <ReakitMenuBar
        as={Styled.Toolbar}
        aria-label="Rich text toolbar"
        {...menu}
      >
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
              { format: "p", label: "Paragraph" },
              { format: "h1", label: "Heading 1" },
              { format: "h2", label: "Heading 2" },
              { format: "h3", label: "Heading 3" },
              { format: "h4", label: "Heading 4" },
              { format: "h5", label: "Heading 5" },
              { format: "h6", label: "Heading 6" },
              { format: "", label: "--" }
            ]}
            {...menu}
          />
          <Styled.ToolbarSpacer />
        </Styled.ToolGroup>
        <Styled.ToolGroup>
          <ReakitMenuItem
            as={MarkButton}
            icon="bold24"
            format="bold"
            {...menu}
          />
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
          <ReakitMenuItem
            as={MarkButton}
            icon="code24"
            format="code"
            {...menu}
          />
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
      <Styled.BreadcrumbsBar $darkMode={darkMode}>
        {true &&
          Object.keys(ancestors).map((a, i) => {
            /* eslint-disable no-nested-ternary */
            const tag = ancestors[a].split(".")[0].split("#")[0];
            const color = rteElements.includes(tag)
              ? "green"
              : inlineNodes.includes(tag)
              ? "blue"
              : "yellow";

            return (
              <Fragment key={a}>
                <Styled.Breadcrumb
                  $color={color}
                  $darkMode={darkMode}
                  onMouseEnter={() => setSelectedCrumb(a)}
                  onMouseLeave={() => setSelectedCrumb(null)}
                  onClick={e => {
                    e.preventDefault();
                    setSelectedCrumb(a);
                  }}
                >
                  {ancestors[a]}
                </Styled.Breadcrumb>
                {i < Object.keys(ancestors).length - 1 && (
                  <Styled.Spacer icon="disclosureDown16" size={16} />
                )}
              </Fragment>
            );
          })}
        <Styled.ShowHideButton
          onClick={onToggleHtmlOutlines}
          aria-label={
            selectedCrumb === "all"
              ? "Hide all HTML element outlines"
              : "Show all HTML element outlines"
          }
        >
          <IconComposer icon="eyeball24" size={24} />
        </Styled.ShowHideButton>
      </Styled.BreadcrumbsBar>
    </>
  );
}

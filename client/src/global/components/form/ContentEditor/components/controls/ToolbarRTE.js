import React, { Fragment, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  MarkButton,
  BlockButton,
  LinkButton,
  ImageButton,
  IframeButton,
  BlockSelect,
  FunctionButton,
  SpanButton
} from "./buttons";
import {
  MenuBar as ReakitMenuBar,
  MenuItem as ReakitMenuItem,
  useMenuBarState
} from "reakit/Menu";
import { Node } from "slate";
import { useSlateStatic, useSlateSelection } from "slate-react";
import { getAncestors } from "../../utils/slate/getters";
import { useHtmlBreadcrumbs } from "../../contexts/htmlBreadcrumbsContext";
import { rteElements, inlineNodes } from "../../utils/elements";
import IconComposer from "global/components/utility/IconComposer";
import isEmpty from "lodash/isEmpty";
import * as Styled from "./styles";

export default function ToolbarRTE({ onClickUndo, onClickRedo, darkMode }) {
  const { t } = useTranslation();

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

  const {
    setSelectedCrumb,
    selectedCrumb,
    editingCrumb,
    setEditingCrumb
  } = useHtmlBreadcrumbs();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (editingCrumb) {
      setEditingCrumb(false);
      setSelectedCrumb(null);
    }
  }, [editor.selection]);

  const onToggleHtmlOutlines = useCallback(
    e => {
      e.preventDefault();

      const val = selectedCrumb === "all" ? null : "all";
      setSelectedCrumb(val);
    },
    [selectedCrumb, setSelectedCrumb]
  );

  const handleHoverFocus = useCallback(
    a => {
      if (!editingCrumb) setSelectedCrumb(a);
    },
    [editingCrumb]
  );

  const clearHoverFocus = useCallback(() => {
    if (!editingCrumb) setSelectedCrumb(null);
  }, [editingCrumb]);

  return (
    <>
      <ReakitMenuBar
        as={Styled.Toolbar}
        aria-label={t("editor.controls.labels.toolbar_rte")}
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
            name="container"
            ariaLabel={t("editor.controls.labels.layout_block_select")}
            options={[
              { format: "div", label: t("editor.tooltips.labels.div") },
              { format: "header", label: t("editor.tooltips.labels.header") },
              { format: "footer", label: t("editor.tooltips.labels.footer") },
              { format: "section", label: t("editor.tooltips.labels.section") },
              { format: "article", label: t("editor.tooltips.labels.article") },
              {
                format: "blockquote",
                label: t("editor.tooltips.labels.blockquote")
              },
              { format: "pre", label: t("editor.tooltips.labels.pre") },
              { format: "figure", label: t("editor.tooltips.labels.figure") },
              {
                format: "figcaption",
                label: t("editor.tooltips.labels.figcaption")
              },
              {
                format: "",
                label: t(
                  "editor.controls.labels.layout_block_select_placeholder"
                )
              }
            ]}
            color="var(--color-base-violet45)"
            {...menu}
          />
          <Styled.ToolbarSpacer />
        </Styled.ToolGroup>
        <Styled.ToolGroup>
          <ReakitMenuItem
            as={BlockSelect}
            name="textBlock"
            ariaLabel={t("editor.controls.labels.text_block_select")}
            options={[
              { format: "p", label: t("editor.tooltips.labels.p") },
              { format: "h1", label: t("editor.tooltips.labels.h1") },
              { format: "h2", label: t("editor.tooltips.labels.h2") },
              { format: "h3", label: t("editor.tooltips.labels.h3") },
              { format: "h4", label: t("editor.tooltips.labels.h4") },
              { format: "h5", label: t("editor.tooltips.labels.h5") },
              { format: "h6", label: t("editor.tooltips.labels.h6") },
              {
                format: "",
                label: t("editor.controls.labels.text_block_select_placeholder")
              }
            ]}
            {...menu}
          />
          <Styled.ToolbarSpacer />
        </Styled.ToolGroup>
        <Styled.ToolGroup>
          <ReakitMenuItem as={SpanButton} format="span" {...menu} />
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
          {/* <ReakitMenuItem
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
          /> */}
          <Styled.ToolbarSpacer />
        </Styled.ToolGroup>
        <Styled.ToolGroup>
          <ReakitMenuItem as={LinkButton} icon="RTELink24" {...menu} />
          <ReakitMenuItem as={ImageButton} icon="RTEImage24" {...menu} />
          <ReakitMenuItem as={IframeButton} icon="iframe24" {...menu} />
        </Styled.ToolGroup>
      </ReakitMenuBar>
      <Styled.BreadcrumbsBar $darkMode={darkMode}>
        <Styled.Breadcrumbs>
          {!isEmpty(ancestors) &&
            Object.keys(ancestors)
              .sort(
                (a, b) => ancestors[a].path.length - ancestors[b].path.length
              )
              .map((a, i) => {
                /* eslint-disable no-nested-ternary */
                const tag = ancestors[a].label.split(".")[0].split("#")[0];
                const color = rteElements.includes(tag)
                  ? "green"
                  : inlineNodes.includes(tag)
                  ? "blue"
                  : "violet";

                return (
                  <Fragment key={a}>
                    <Styled.Breadcrumb
                      $color={color}
                      $darkMode={darkMode}
                      onMouseEnter={() => handleHoverFocus(a)}
                      onMouseLeave={clearHoverFocus}
                      onFocus={() => handleHoverFocus(a)}
                      onBlur={clearHoverFocus}
                      onClick={e => {
                        e.preventDefault();
                        setSelectedCrumb(a);
                        setEditingCrumb(true);
                      }}
                    >
                      {ancestors[a].label}
                    </Styled.Breadcrumb>
                    {i < Object.keys(ancestors).length - 1 && (
                      <Styled.Spacer icon="disclosureDown16" size={16} />
                    )}
                  </Fragment>
                );
              })}
        </Styled.Breadcrumbs>
        <Styled.ShowHideButton
          onClick={onToggleHtmlOutlines}
          aria-label={
            selectedCrumb === "all"
              ? t("editor.controls.labels.hide_html")
              : t("editor.controls.labels.show_html")
          }
        >
          <IconComposer icon="eyeball24" size={24} />
        </Styled.ShowHideButton>
      </Styled.BreadcrumbsBar>
    </>
  );
}

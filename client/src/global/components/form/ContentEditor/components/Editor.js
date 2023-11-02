import React, { useState, useCallback, useEffect, useRef } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Transforms, Editor as SlateEditor } from "slate";
import { withReact, ReactEditor, useSlate } from "slate-react";
import { HistoryEditor } from "slate-history";
import Leaf from "./renderers/Leaf";
import Element from "./renderers/Element";
import { captureHotKeys } from "../hotkeys";
import { serializeToHtml, serializeToSlate } from "../serializers";
import { clearSlate } from "../utils/slate/general";
import HtmlEditor from "./HtmlEditor";
import Controls from "./EditorControls";
import { formatHtml } from "../utils/helpers";
import * as Styled from "./styles";

export default function Editor({
  localHtml,
  localSlate,
  setLocalHtml,
  onChangeHtml,
  setLocalSlate,
  stylesheets,
  hasErrors,
  setHasErrors,
  warnErrors,
  setWarnErrors,
  nextRef,
  htmlMode,
  toggleHtmlMode
}) {
  const editor = useSlate();
  const aceRef = useRef();
  const controlsRef = useRef();

  const [showCss, toggleCss] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const { t } = useTranslation();

  // Since the editor overflows the visible area and we scroll the whole drawer, we have to manually handle scroll when arrow keys are used to move the cursor out of view.
  useEffect(() => {
    const active = document.activeElement;
    if (active?.id === "content-editable" && editor.selection && !htmlMode) {
      const [node] = ReactEditor.toDOMPoint(editor, editor.selection.focus);
      const rect = node.parentElement.getBoundingClientRect();
      const buttons = document.getElementById("editor-button-overlay");
      const controls = document.getElementById("editor-controls");
      const buttonsRect = buttons.getBoundingClientRect();
      const controlsRect = controls.getBoundingClientRect();
      const isInView =
        rect.bottom < buttonsRect.top && rect.y > controlsRect.bottom;
      if (!isInView) {
        node.parentElement.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }
  }, [editor, editor.selection, htmlMode]);

  const theme = stylesheets?.map(s => s?.attributes.styles).join("\n");

  const renderElement = useCallback(
    props => <Element {...props} theme={theme} darkMode={darkMode} />,
    [theme, darkMode]
  );

  const renderLeaf = useCallback(
    props => <Leaf {...props} darkMode={darkMode} />,
    [darkMode]
  );

  const toggleEditorView = () => {
    if (htmlMode) {
      const json = serializeToSlate(localHtml);
      setLocalSlate(json);
      clearSlate(editor);
      Transforms.insertNodes(editor, json);
      Transforms.select(editor, {
        anchor: SlateEditor.start(editor, [0]),
        focus: SlateEditor.start(editor, [0])
      });
      return toggleHtmlMode(false);
    }

    const html = formatHtml(serializeToHtml(localSlate));
    setLocalHtml(html);
    toggleCss(false);
    return toggleHtmlMode(true);
  };

  const onClickToggle = val => e => {
    e.stopPropagation();
    e.preventDefault();
    if (hasErrors) {
      setWarnErrors("switch");
      return;
    }
    if (val && htmlMode) return;
    if (!val && !htmlMode) return;
    toggleEditorView();
  };

  const onValidateHtml = messages => {
    const errorFound = messages.find(msg => msg.type === "error");
    if (!errorFound) {
      setHasErrors(false);
      return setWarnErrors(false);
    }
    setHasErrors(true);
  };

  const htmlProps = {
    onChange: onChangeHtml,
    value: localHtml,
    onValidate: onValidateHtml,
    mode: "html",
    aceRef,
    nextRef,
    prevRef: controlsRef,
    darkMode
  };

  const cssProps = {
    value: theme,
    mode: "css",
    readOnly: true,
    onValidate: () => {},
    aceRef,
    nextRef,
    prevRef: controlsRef,
    darkMode
  };

  const codeAreaProps = showCss ? cssProps : htmlProps;

  const toggleStyles = e => {
    e.preventDefault();
    toggleCss(!showCss);
  };

  const onClickUndo = e => {
    e.preventDefault();
    if (!htmlMode) return HistoryEditor.undo(editor);
    aceRef.current.editor.undo();
  };

  const onClickRedo = e => {
    e.preventDefault();
    if (!htmlMode) return HistoryEditor.redo(editor);
    aceRef.current.editor.redo();
  };

  const wrapperClasses = classNames(
    "manifold-text-section text-section font-size-2",
    {
      "scheme-dark": darkMode,
      "scheme-light": !darkMode
    }
  );

  const onClickDarkModeToggle = val => e => {
    e.preventDefault();
    setDarkMode(val);
  };

  /* eslint-disable no-nested-ternary */
  const errors = warnErrors
    ? Array.isArray(hasErrors)
      ? hasErrors
      : [
          {
            source: { pointer: "/data/attributes/body" },
            detail: t(`errors.invalid_html_${warnErrors}`)
          }
        ]
    : [];

  return (
    <>
      <Controls
        htmlMode={htmlMode}
        darkMode={darkMode}
        onClickEditorToggle={onClickToggle}
        onClickDarkModeToggle={onClickDarkModeToggle}
        onClickUndo={onClickUndo}
        onClickRedo={onClickRedo}
        toggleStyles={toggleStyles}
        cssVisible={showCss}
        errors={errors}
        controlsRef={controlsRef}
      />
      <Styled.EditableWrapper className={wrapperClasses} $cssVisible={showCss}>
        {!htmlMode && (
          <Styled.Editable
            id={"content-editable"}
            as="div"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={t("editor.elements.placeholder")}
            spellCheck={false}
            onKeyDown={e => captureHotKeys(e, editor)}
          />
        )}
        {htmlMode && <HtmlEditor {...codeAreaProps} />}
      </Styled.EditableWrapper>
      {theme && !htmlMode && (
        <style
          dangerouslySetInnerHTML={{
            __html: `@layer stylesheets {${theme}}`
          }}
        />
      )}
    </>
  );
}

Editor.displayName = "Global.Forms.ContentEditor.Editor";

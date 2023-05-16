import React, { useState, useCallback, useEffect, useRef } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { createEditor, Transforms, Editor as SlateEditor } from "slate";
import { Slate, withReact, ReactEditor } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import { Leaf, Element } from "./renderers";
import { captureHotKeys } from "../transforms";
import { serializeToHtml, serializeToSlate } from "../serializers";
import { HtmlEditor } from "./HtmlEditor";
import Controls from "./EditorControls";
import withPlugins from "../plugins";
import { clearSlate, formatHtml } from "../utils/helpers";
import { ErrorBoundary } from "react-error-boundary";
import isEqual from "lodash/isEqual";
import * as Styled from "./styles";

export default function Editor({
  set: setFormValue,
  initialSlateValue,
  initialHtmlValue,
  stylesheets,
  hasErrors,
  setHasErrors,
  warnErrors,
  setWarnErrors,
  errors: formErrors = [],
  nextRef
}) {
  const editorRef = useRef();
  if (!editorRef.current)
    editorRef.current = withHistory(withReact(withPlugins(createEditor())));
  const editor = editorRef.current;
  const aceRef = useRef();
  const controlsRef = useRef();

  const [htmlMode, toggleHtmlMode] = useState(true);
  const [showCss, toggleCss] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [localHtml, setLocalHtml] = useState(initialHtmlValue);
  const [localSlate, setLocalSlate] = useState(initialSlateValue);
  const prevSlate = useRef(initialSlateValue);
  const prevHtml = useRef(initialHtmlValue);

  const { t } = useTranslation();

  // The value prop on the Slate provider component is unhelpfully named. It is really initialSlateValue and is only read once, so it's easy for Slate to get out of sync when waiting for data from the api. This resets the editor each time the form model changes.
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!htmlMode && !isEqual(prevSlate.current, initialSlateValue)) {
      clearSlate(editor);
      Transforms.insertNodes(editor, initialSlateValue);
      return;
    }
    if (!isEqual(prevHtml.current, initialHtmlValue)) {
      setLocalHtml(initialHtmlValue);
    }
  }, [initialSlateValue, initialHtmlValue]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Since the editor overflows the visible area and we scroll the whole drawer, we have to manually handle scroll when arrow keys are used to move the cursor out of view.
  useEffect(() => {
    if (editor.selection && !htmlMode) {
      const [node] = ReactEditor.toDOMPoint(editor, editor.selection.focus);
      const rect = node.parentElement.getBoundingClientRect();
      const buttons = document.getElementById("editor-button-overlay");
      const controls = document.getElementById("editor-controls");
      const buttonsRect = buttons.getBoundingClientRect();
      const controlsRect = controls.getBoundingClientRect();
      const isInView = rect.y < buttonsRect.top && rect.y > controlsRect.bottom;
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

  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  const onChangeSlate = val => {
    setLocalSlate(val);
    setFormValue(val);
  };

  const onChangeHtml = val => {
    setLocalHtml(val);
    setFormValue(val);
  };

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
    if (!errorFound) setWarnErrors(false);
    setHasErrors(errorFound);
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

  const handleError = ({ resetErrorBoundary }) => {
    HistoryEditor.undo(editor);
    resetErrorBoundary();
    return null;
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

  const errors = warnErrors
    ? [
        {
          source: { pointer: "/data/attributes/body" },
          detail: t(`errors.invalid_html_${warnErrors}`)
        },
        ...formErrors
      ]
    : [...formErrors];

  return (
    <>
      <Styled.EditorSecondary
        className={hasErrors && warnErrors ? "error" : undefined}
      >
        <ErrorBoundary fallbackRender={handleError}>
          <Slate editor={editor} value={localSlate} onChange={onChangeSlate}>
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
            <Styled.EditableWrapper
              className={wrapperClasses}
              $cssVisible={showCss}
            >
              {!htmlMode && (
                <Styled.Editable
                  as="div"
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  placeholder="Section body..."
                  spellCheck={false}
                  onKeyDown={e => captureHotKeys(e, editor)}
                />
              )}
              {htmlMode && <HtmlEditor {...codeAreaProps} />}
            </Styled.EditableWrapper>
            {theme && !htmlMode && (
              <style
                dangerouslySetInnerHTML={{
                  __html: theme
                }}
              />
            )}
          </Slate>
        </ErrorBoundary>
      </Styled.EditorSecondary>
    </>
  );
}

Editor.displayName = "Global.Forms.ContentEditor.Editor";

import React, { useState, useCallback, useEffect, useRef } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { createEditor, Transforms } from "slate";
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
import isEmpty from "lodash/isEmpty";
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
  errors: formErrors = []
}) {
  const editorRef = useRef();
  if (!editorRef.current)
    editorRef.current = withHistory(withReact(withPlugins(createEditor())));
  const editor = editorRef.current;
  const aceRef = useRef();

  const [htmlMode, toggleHtmlMode] = useState(true);
  const [showCss, toggleCss] = useState(false);
  const [darkMode, toggleDarkMode] = useState(true);

  const [localHtml, setLocalHtml] = useState(initialHtmlValue);
  const [localSlate, setLocalSlate] = useState(initialSlateValue);
  const prevSlate = useRef(initialSlateValue);

  const { t } = useTranslation();

  // The value prop on the Slate component is unhelpfully named. It is really initialSlateValue and is only read once, so it's possible for Slate to get out of sync when switching between text sections. This resets the editor each time the form model changes.
  useEffect(() => {
    if (prevSlate.current !== initialSlateValue) {
      clearSlate(editor);
      Transforms.insertNodes(editor, initialSlateValue);
    }
  }, [initialSlateValue, editor]);

  const [lastActiveSelection, setLastActiveSelection] = useState({});

  const onEditorBlur = () => {
    if (editor.selection != null) setLastActiveSelection(editor.selection);
  };

  const onEditorFocus = () => {
    if (!editor.selection && !isEmpty(lastActiveSelection))
      Transforms.select(editor, lastActiveSelection);
  };

  const theme = stylesheets?.map(s => s?.attributes.styles).join("\n");

  const renderElement = useCallback(props => <Element {...props} />, []);

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
      return toggleHtmlMode(false);
    }

    const html = formatHtml(serializeToHtml(localSlate));
    setLocalHtml(html);
    toggleCss(false);
    return toggleHtmlMode(true);
  };

  const onClickToggle = e => {
    e.stopPropagation();
    e.preventDefault();
    if (hasErrors) {
      setWarnErrors("switch");
      return;
    }
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
    aceRef
  };

  const cssProps = {
    value: theme,
    mode: "css",
    readOnly: true,
    onValidate: () => {}
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

  const wrapperClasses = classNames("manifold-text-section font-size-2", {
    "scheme-dark": darkMode,
    "scheme-light": !darkMode
  });

  const onClickDarkModeToggle = e => {
    e.preventDefault();
    toggleDarkMode(!darkMode);
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
              selection={lastActiveSelection}
              htmlMode={htmlMode}
              darkMode={darkMode}
              onClickEditorToggle={onClickToggle}
              onClickDarkModeToggle={onClickDarkModeToggle}
              onClickUndo={onClickUndo}
              onClickRedo={onClickRedo}
              toggleStyles={toggleStyles}
              cssVisible={showCss}
              errors={errors}
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
                  onBlur={onEditorBlur}
                  onFocus={onEditorFocus}
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

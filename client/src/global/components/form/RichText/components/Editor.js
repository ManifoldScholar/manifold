import React, { useState, useCallback, useEffect, useRef } from "react";
import { createEditor, Transforms } from "slate";
import { Slate, withReact, ReactEditor } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import { Leaf, Element } from "./renderers";
import Toolbar from "./Toolbar";
import { captureHotKeys } from "../transforms";
import { serializeToHtml, serializeToSlate } from "../serializers";
import { HtmlEditor } from "./HtmlEditor";
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
  setWarnErrors
}) {
  const editorRef = useRef();
  if (!editorRef.current)
    editorRef.current = withHistory(withReact(withPlugins(createEditor())));
  const editor = editorRef.current;

  const [htmlMode, toggleHtmlMode] = useState(false);
  const [localHtml, setLocalHtml] = useState(initialHtmlValue);
  const [localSlate, setLocalSlate] = useState(initialSlateValue);
  const prevSlate = useRef(initialSlateValue);

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

  const theme = stylesheets?.map(s => s.attributes.styles).join("\n");

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
    return toggleHtmlMode(true);
  };

  const onClickToggle = e => {
    e.stopPropagation();
    e.preventDefault();
    if (hasErrors) {
      setWarnErrors(true);
      return;
    }
    toggleEditorView();
  };

  const onValidateHtml = messages => {
    const errorFound = messages.find(msg => msg.type === "error");
    if (!errorFound) setWarnErrors(false);
    setHasErrors(errorFound);
  };

  const codeAreaProps = {
    onChange: onChangeHtml,
    value: localHtml,
    onValidate: onValidateHtml
  };

  const handleError = ({ resetErrorBoundary }) => {
    HistoryEditor.undo(editor);
    resetErrorBoundary();
    return null;
  };

  return (
    <Styled.EditorSecondary
      className={hasErrors && warnErrors ? "error" : undefined}
    >
      <ErrorBoundary fallbackRender={handleError}>
        <Slate editor={editor} value={localSlate} onChange={onChangeSlate}>
          <Toolbar
            selection={lastActiveSelection}
            htmlMode={htmlMode}
            onClickToggle={onClickToggle}
          />
          <Styled.EditableWrapper className="manifold-text-section">
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
  );
}

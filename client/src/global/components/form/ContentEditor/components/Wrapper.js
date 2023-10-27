import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import FieldWrapper from "../../FieldWrapper";
import { ErrorBoundary } from "react-error-boundary";
import { Slate, withReact, ReactEditor } from "slate-react";
import { createEditor, Transforms } from "slate";
import { withHistory, HistoryEditor } from "slate-history";
import withPlugins from "../plugins";
import throttle from "lodash/throttle";
import { serializeToHtml, removeFormatting } from "../serializers";
import { clearSlate } from "../utils/slate/general";
import isEqual from "lodash/isEqual";
import has from "lodash/has";
import Editor from "./Editor";
import { HtmlBreadcrumbsContext } from "../contexts/htmlBreadcrumbsContext";
import * as Styled from "./styles";

export default function EditorWrapper({
  set: setFormValue,
  stylesheets,
  initialHtmlValue,
  initialSlateValue,
  hasErrors,
  setHasErrors,
  warnErrors,
  setWarnErrors,
  nextRef
}) {
  const editorRef = useRef();
  if (!editorRef.current)
    editorRef.current = withReact(withHistory(withPlugins(createEditor())));
  const editor = editorRef.current;

  const prevSlate = useRef(initialSlateValue);
  const prevHtml = useRef(initialHtmlValue);

  const [htmlMode, toggleHtmlMode] = useState(has(initialSlateValue, "error"));
  const [selectedCrumb, setSelectedCrumb] = useState();
  const [editingCrumb, setEditingCrumb] = useState(false);
  const [localHtml, setLocalHtml] = useState(initialHtmlValue);
  const [localSlate, setLocalSlate] = useState(
    has(initialSlateValue, "error")
      ? initialSlateValue.default
      : initialSlateValue
  );

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

  const setFormValueFromSlate = throttle(
    val => setFormValue(serializeToHtml(val)),
    500
  );

  const onChangeSlate = val => {
    setLocalSlate(val);
    const changes = editor?.history?.undos ?? [];
    const shouldUpdateFormValue =
      changes.length > 1 || changes[0]?.selectionBefore;
    if (shouldUpdateFormValue) setFormValueFromSlate(val);
  };

  const setFormValueFromHtml = throttle(
    val => setFormValue(removeFormatting(val)),
    500
  );

  const onChangeHtml = val => {
    setLocalHtml(val);
    setFormValueFromHtml(val);
  };

  const handleError = ({ resetErrorBoundary }) => {
    HistoryEditor.undo(editor);
    resetErrorBoundary();
    return null;
  };

  return (
    <FieldWrapper className="wide">
      <Styled.EditorSecondary
        className={hasErrors && warnErrors ? "error" : undefined}
      >
        <ErrorBoundary fallbackRender={handleError}>
          <HtmlBreadcrumbsContext.Provider
            value={{
              selectedCrumb,
              setSelectedCrumb,
              editingCrumb,
              setEditingCrumb
            }}
          >
            <Slate editor={editor} value={localSlate} onChange={onChangeSlate}>
              <Editor
                localHtml={localHtml}
                setLocalHtml={setLocalHtml}
                onChangeHtml={onChangeHtml}
                localSlate={localSlate}
                setLocalSlate={setLocalSlate}
                stylesheets={stylesheets}
                htmlMode={htmlMode}
                toggleHtmlMode={toggleHtmlMode}
                hasErrors={hasErrors}
                setHasErrors={setHasErrors}
                warnErrors={warnErrors}
                setWarnErrors={setWarnErrors}
                nextRef={nextRef}
              />
            </Slate>
          </HtmlBreadcrumbsContext.Provider>
        </ErrorBoundary>
      </Styled.EditorSecondary>
    </FieldWrapper>
  );
}

EditorWrapper.displayName = "Global.Form.ContentEditor.Wrapper";

EditorWrapper.propTypes = {
  set: PropTypes.func,
  stylesheets: PropTypes.arrayOf(PropTypes.object),
  sectionId: PropTypes.string,
  sectionBody: PropTypes.string
};

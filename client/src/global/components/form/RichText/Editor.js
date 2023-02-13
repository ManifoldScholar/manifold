import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef
} from "react";
import { createEditor, Transforms, Path, Editor as SlateEditor } from "slate";
import { Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { Leaf, Element } from "./renderers";
import {
  MarkButton,
  BlockButton,
  ToggleHTML,
  LinkButton,
  ImageButton
} from "./controls";
import { serializeToHtml, serializeToSlate } from "./serializers";
import { HTMLEditor } from "./loaders";
import { withVoids, withInlines, withImages } from "./slate-plugins";
import { clearSlate, formatHtml } from "./slateHelpers";
import { inlineNodes } from "./rteElements";
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
  const editor = useMemo(
    () =>
      withHistory(
        withReact(withInlines(withVoids(withImages(createEditor()))))
      ),
    []
  );
  const [htmlMode, toggleHtmlMode] = useState(false);
  const [localHtml, setLocalHtml] = useState(initialHtmlValue);
  const [localSlate, setLocalSlate] = useState(initialSlateValue);
  const prevSlate = useRef(initialSlateValue);

  useEffect(() => {
    if (prevSlate.current !== initialSlateValue) {
      clearSlate(editor);
      Transforms.insertNodes(editor, initialSlateValue);
    }
  }, [initialSlateValue, editor]);

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

  const onKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      // handle case where prev is a span or other inline
      const prev = SlateEditor.above(editor, editor.selection);
      const focusOffset = editor.selection.focus.offset;
      const endOffset = SlateEditor.end(editor, prev[1]).offset;

      if (focusOffset !== endOffset || inlineNodes.includes(prev[0].type)) {
        Transforms.splitNodes(editor, { at: editor.selection });
      } else {
        const { children, htmlAttrs, ...next } = prev[0];
        const path = Path.next(prev[1]);
        Transforms.insertNodes(
          editor,
          { ...next, children: [] },
          { at: editor.selection }
        );
        Transforms.select(editor, {
          anchor: { path: [...path, 0], offset: 0 },
          focus: { path: [...path, 0], offset: 0 }
        });
      }
    }
  };

  return (
    <Styled.EditorSecondary
      className={hasErrors && warnErrors ? "error" : undefined}
    >
      <Slate editor={editor} value={localSlate} onChange={onChangeSlate}>
        <Styled.Toolbar>
          <MarkButton icon="bold16" format="bold" />
          <MarkButton icon="italic16" format="italic" />
          <MarkButton icon="underline16" format="underline" />
          <MarkButton icon="strikethrough16" format="strikethrough" />
          <LinkButton icon="resourceLink64" size={20} />
          <BlockButton icon="headingOne16" format="h1" />
          <BlockButton icon="headingTwo16" format="h2" />
          <BlockButton icon="headingThree16" format="h3" />
          <BlockButton icon="orderedList16" format="ol" />
          <BlockButton icon="unorderedList16" format="ul" />
          <BlockButton icon="blockQuote16" format="blockquote" />
          <ImageButton icon="resourceImage64" size={20} />
          <BlockButton icon="resourceVideo64" size={20} />
          <ToggleHTML icon="code16" active={htmlMode} onClick={onClickToggle} />
        </Styled.Toolbar>
        <Styled.EditableWrapper className="manifold-text-section">
          {!htmlMode && (
            <Styled.Editable
              as="div"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Enter text here..."
              spellCheck={false}
              onKeyDown={onKeyDown}
            />
          )}
          {htmlMode && <HTMLEditor {...codeAreaProps} />}
        </Styled.EditableWrapper>
        {theme && (
          <style
            dangerouslySetInnerHTML={{
              __html: theme
            }}
          />
        )}
      </Slate>
    </Styled.EditorSecondary>
  );
}

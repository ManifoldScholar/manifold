import React, { useState, useCallback } from "react";
import {
  createEditor,
  Transforms,
  Node,
  Editor as SlateEditor,
  Element as SlateElement
} from "slate";
import { Slate, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import { Leaf, Element } from "./renderers";
import { MarkButton, BlockButton, ToggleHTML } from "./controls";
import { serializeToHtml, serializeToSlate } from "./serializers";
import { parseDocument } from "htmlparser2";
import serializer from "dom-serializer";
import Prism from "prismjs";
import { normalizeTokens } from "./normalizeTokens";
import theme from "./prism";
import { useUIDSeed } from "react-uid";
import * as Styled from "./styles";

const defaultValue = [
  {
    type: "p",
    children: [{ text: "" }]
  }
];

export default function Editor({ set, value }) {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [htmlMode, toggleHtmlMode] = useState(false);
  const seed = useUIDSeed("line");

  const renderElement = useCallback(props => <Element {...props} />, []);

  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  const onChangeHtml = val => {
    if (val[0].type === "html") {
      const toString = nodes => nodes.map(n => Node.string(n)).join("");
      const update = toString(val[0].children);
      return set(update);
    }
    set(serializeToHtml(val));
  };

  const getChildNodeToDecorations = ([block, blockPath]) => {
    const text = block.children
      .map(line => {
        if (line.children.length > 1) {
          return line.children.map(c => Node.string(c));
        }
        return Node.string(line);
      })
      .flat(5)
      .join("\n");
    const tokens = Prism.tokenize(text, Prism.languages.html);
    const normalizedTokens = normalizeTokens(tokens); // make tokens flat and grouped by line

    const decorations = normalizedTokens
      .map((nts, i) => {
        let start = 0;

        return nts
          .map(t => {
            const length = t.content.length;
            if (!length) {
              return null;
            }

            const end = start + length;
            const path = [...blockPath, i, 0];
            const range = {
              path,
              anchor: { path, offset: start },
              focus: { path, offset: end },
              token: true,
              ...Object.fromEntries(t.types.map(type => [type, true]))
            };

            start = end;
            return range;
          })
          .filter(Boolean);
      })
      .reduce((acc, ranges, i) => ({ ...acc, [i]: ranges }), {});

    return decorations;
  };

  const SetNodeToDecorations = () => {
    const test = useSlate();
    const blockEntries = Array.from(
      SlateEditor.nodes(test, {
        at: [],
        mode: "highest",
        match: n => SlateElement.isElement(n) && n.type === "html"
      })
    );

    const nodeToDecorations = blockEntries.map(getChildNodeToDecorations);

    test.nodeToDecorations = nodeToDecorations;

    return null;
  };

  const getUid = node => {
    if (!node.id && !node.children) return null;
    if (node.children.length === 1) return node.id;
    return node.children.map(getUid);
  };

  const useDecorate = () => {
    return useCallback(([node, path]) => {
      const uidIndex = editor.children
        .map(c => getUid(c))
        .flat(10)
        .filter(Boolean);
      if (
        SlateElement.isElement(node) &&
        node.type === "code-line" &&
        node.id
      ) {
        const index = uidIndex.indexOf(node.id);
        if (index < 0) return [];
        const ranges = editor.nodeToDecorations[0][index] || [];
        const patched = ranges.map(r => {
          return {
            ...r,
            path,
            anchor: { ...r.anchor, path },
            focus: { ...r.focus, path }
          };
        });
        return patched;
      }

      return [];
    }, []);
  };

  const decorate = useDecorate();

  const toggleEditorView = () => {
    if (htmlMode) {
      const toString = nodes => nodes.map(n => Node.string(n)).join("");
      const currentVal = toString(editor.children);
      const json = serializeToSlate(currentVal);
      Transforms.removeNodes(editor, { at: [0] });
      Transforms.insertNodes(editor, json);
      return toggleHtmlMode(false);
    }

    const currentVal = editor.children;
    const html = serializeToHtml(currentVal);

    const count = Array(editor.children.length).keys();
    [...count].forEach(() => {
      try {
        Transforms.removeNodes(editor, { at: [0] });
      } catch (e) {
        console.log(e);
      }
    });

    const openTag = (tag, i, j) => ({
      id: seed(`${i}-${j}`),
      type: "code-line",
      children: [{ text: `<${tag}>` }]
    });
    const closeTag = (tag, i, j) => ({
      id: seed(`${i}-${j}`),
      type: "code-line",
      children: [{ text: `</${tag}>` }]
    });

    const toChildren = content => [{ text: content }];
    const toCodeLines = (nodes, i) => {
      return nodes.map((node, j) => {
        if (node?.children?.length > 1) {
          return {
            id: seed(`${i}-${j}`),
            type: "code-line",
            children: [
              openTag(node.name, i + j, "open"),
              ...toCodeLines(node.children, i + j),
              closeTag(node.name, i + j, "close")
            ]
          };
        }
        return {
          id: seed(`${i}-${j}`),
          type: "code-line",
          children: toChildren(serializer(node))
        };
      });
    };

    const htmlValue = [
      {
        type: "html",
        children: toCodeLines(parseDocument(html).children, 0)
      }
    ];

    Transforms.insertNodes(editor, htmlValue, {
      at: [editor.children.length]
    });
    toggleHtmlMode(true);
  };

  const onClickHtml = e => {
    e.stopPropagation();
    e.preventDefault();
    toggleEditorView();
  };

  const initialValue = value ? serializeToSlate(value) : defaultValue;

  return (
    <Styled.EditorSecondary>
      <Slate editor={editor} value={initialValue} onChange={onChangeHtml}>
        <Styled.Toolbar>
          <MarkButton icon="bold16" format="bold" />
          <MarkButton icon="italic16" format="italic" />
          <MarkButton icon="underline16" format="underline" />
          <BlockButton icon="headingOne16" format="h1" />
          <BlockButton icon="headingTwo16" format="h2" />
          <BlockButton icon="orderedList16" format="ol" />
          <BlockButton icon="unorderedList16" format="ul" />
          <BlockButton icon="blockQuote16" format="blockquote" />
          <ToggleHTML icon="code16" active={htmlMode} onClick={onClickHtml} />
        </Styled.Toolbar>
        {htmlMode && <SetNodeToDecorations />}
        <Styled.Editable
          as="div"
          decorate={htmlMode ? decorate : undefined}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter text here..."
          spellCheck
        />
        <style>{theme}</style>
      </Slate>
    </Styled.EditorSecondary>
  );
}

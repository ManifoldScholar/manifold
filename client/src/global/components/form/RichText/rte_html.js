// const getChildNodeToDecorations = ([block, blockPath]) => {
//   const text = block.children
//     .map(line => {
//       if (line.children.length > 1) {
//         return line.children.map(c => Node.string(c));
//       }
//       return Node.string(line);
//     })
//     .flat(5)
//     .join("\n");
//   const tokens = Prism.tokenize(text, Prism.languages.html);
//   const normalizedTokens = normalizeTokens(tokens); // make tokens flat and grouped by line
//
//   const decorations = normalizedTokens
//     .map((nts, i) => {
//       let start = 0;
//
//       return nts
//         .map(t => {
//           const length = t.content.length;
//           if (!length) {
//             return null;
//           }
//
//           const end = start + length;
//           const path = [...blockPath, i, 0];
//           const range = {
//             path,
//             anchor: { path, offset: start },
//             focus: { path, offset: end },
//             token: true,
//             ...Object.fromEntries(t.types.map(type => [type, true]))
//           };
//
//           start = end;
//           return range;
//         })
//         .filter(Boolean);
//     })
//     .reduce((acc, ranges, i) => ({ ...acc, [i]: ranges }), {});
//
//   return decorations;
// };
//
// const SetNodeToDecorations = () => {
//   const test = useSlate();
//   const blockEntries = Array.from(
//     SlateEditor.nodes(test, {
//       at: [],
//       mode: "highest",
//       match: n => SlateElement.isElement(n) && n.type === "html"
//     })
//   );
//
//   const nodeToDecorations = blockEntries.map(getChildNodeToDecorations);
//
//   test.nodeToDecorations = nodeToDecorations;
//
//   return null;
// };
//
// const getUid = node => {
//   if (!node.id && !node.children) return null;
//   if (node.children.length === 1) return node.id;
//   return node.children.map(getUid);
// };
//
// const useDecorate = () => {
//   return useCallback(([node, path]) => {
//     const uidIndex = editor.children
//       .map(c => getUid(c))
//       .flat(10)
//       .filter(Boolean);
//     if (SlateElement.isElement(node) && node.type === "code-line" && node.id) {
//       const index = uidIndex.indexOf(node.id);
//       if (index < 0) return [];
//       const ranges = editor.nodeToDecorations[0][index] || [];
//       const patched = ranges.map(r => {
//         return {
//           ...r,
//           path,
//           anchor: { ...r.anchor, path },
//           focus: { ...r.focus, path }
//         };
//       });
//       return patched;
//     }
//
//     return [];
//   }, []);
// };
//
// const decorate = useDecorate();
//
// const openTag = (tag, i, j) => ({
//   id: seed(`${i}-${j}`),
//   type: "code-line",
//   children: [{ text: `<${tag}>` }]
// });
// const closeTag = (tag, i, j) => ({
//   id: seed(`${i}-${j}`),
//   type: "code-line",
//   children: [{ text: `</${tag}>` }]
// });
//
// const toChildren = content => [{ text: content }];
// const toCodeLines = (nodes, i) => {
//   return nodes.map((node, j) => {
//     if (node?.children?.length > 1) {
//       return {
//         id: seed(`${i}-${j}`),
//         type: "code-line",
//         children: [
//           openTag(node.name, i + j, "open"),
//           ...toCodeLines(node.children, i + j),
//           closeTag(node.name, i + j, "close")
//         ]
//       };
//     }
//     return {
//       id: seed(`${i}-${j}`),
//       type: "code-line",
//       children: toChildren(serializer(node))
//     };
//   });
// };
//
// const htmlValue = [
//   {
//     type: "html",
//     children: toCodeLines(parseDocument(html).children, 0)
//   }
// ];
//
// Transforms.insertNodes(editor, htmlValue, {
//   at: [editor.children.length]
// });
// toggleHtmlMode(true);
// };
//
//
//     const count = Array(editor.children.length).keys();
//     [...count].forEach(() => {
//       try {
//         Transforms.removeNodes(editor, { at: [0] });
//       } catch (e) {
//         console.log(e);
//       }
//     });

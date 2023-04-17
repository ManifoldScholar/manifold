import React from "react";
import Loadable from "@docusaurus/react-loadable";

export const HtmlEditor = Loadable({
  loader: () => import("../../CodeArea/Ace").then(ace => ace.default),
  render(Editor, props) {
    const { aceRef, ...rest } = props;
    return (
      <Editor
        ref={aceRef}
        theme="idle_fingers"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        minLines={40}
        maxLines={10000}
        wrapEnabled
        onLoad={editor => {
          editor.once("change", () => {
            editor.session.getUndoManager().reset();
          });
          editor.renderer.setPadding(10, 24);
          editor.renderer.setScrollMargin(24);
        }}
        editorOptions={{ enableAutoIndent: true }}
        {...rest}
      />
    );
  },
  loading: () => null
});

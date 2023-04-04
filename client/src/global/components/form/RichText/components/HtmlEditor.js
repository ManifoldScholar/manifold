import React from "react";
import Loadable from "@docusaurus/react-loadable";

export const HtmlEditor = Loadable({
  loader: () => import("../../CodeArea/Ace").then(ace => ace.default),
  render(Editor, props) {
    return (
      <Editor
        mode="html"
        theme="idle_fingers"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="100%"
        wrapEnabled
        {...props}
      />
    );
  },
  loading: () => null
});

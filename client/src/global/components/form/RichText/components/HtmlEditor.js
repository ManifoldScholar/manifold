import React from "react";
import Loadable from "@docusaurus/react-loadable";

export const HtmlEditor = Loadable({
  loader: () => import("../../CodeArea/Ace").then(ace => ace.default),
  render(Editor, props) {
    return (
      <div style={{ minHeight: "825px" }}>
        <Editor
          mode="html"
          theme="idle_fingers"
          editorProps={{ $blockScrolling: true }}
          width="100%"
          style={{ minHeight: "825px" }}
          minLines={100}
          maxLines={10000}
          wrapEnabled
          {...props}
        />
      </div>
    );
  },
  loading: () => null
});

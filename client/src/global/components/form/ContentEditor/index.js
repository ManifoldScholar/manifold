import React from "react";
import setter from "../setter";
import Loadable from "@docusaurus/react-loadable";

const Editor = Loadable({
  loader: () => import("./components/Wrapper").then(editor => editor.default),
  render(EditorComponent, props) {
    return <EditorComponent {...props} />;
  },
  loading: () => null
});

export default setter(Editor);

Editor.displayName = "Global.Form.ContentEditor.Loader";

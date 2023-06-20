import React from "react";
import PropTypes from "prop-types";
import setter from "../setter";
import FieldWrapper from "../FieldWrapper";
import Loadable from "@docusaurus/react-loadable";

const Editor = Loadable({
  loader: () => import("./components/Editor").then(editor => editor.default),
  render(EditorComponent, props) {
    return <EditorComponent {...props} />;
  },
  loading: () => null
});

function ContentEditor({
  set,
  stylesheets,
  initialHtmlValue,
  initialSlateValue,
  ...props
}) {
  return (
    <FieldWrapper className="wide">
      <Editor
        set={set}
        initialSlateValue={initialSlateValue}
        initialHtmlValue={initialHtmlValue}
        stylesheets={stylesheets}
        {...props}
      />
    </FieldWrapper>
  );
}

export default setter(ContentEditor);

ContentEditor.displayName = "Global.Form.ContentEditor";

ContentEditor.propTypes = {
  set: PropTypes.func,
  stylesheets: PropTypes.arrayOf(PropTypes.object),
  sectionId: PropTypes.string,
  sectionBody: PropTypes.string
};

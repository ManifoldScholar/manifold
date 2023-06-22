import React, { createContext, useState } from "react";
import PropTypes from "prop-types";
import setter from "../setter";
import FieldWrapper from "../FieldWrapper";
import Loadable from "@docusaurus/react-loadable";

export const HtmlBreadcrumbsContext = createContext([]);

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
  const [selectedCrumb, setSelectedCrumb] = useState();

  return (
    <FieldWrapper className="wide">
      <HtmlBreadcrumbsContext.Provider
        value={{ selectedCrumb, setSelectedCrumb }}
      >
        <Editor
          set={set}
          initialSlateValue={initialSlateValue}
          initialHtmlValue={initialHtmlValue}
          stylesheets={stylesheets}
          {...props}
        />
      </HtmlBreadcrumbsContext.Provider>
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

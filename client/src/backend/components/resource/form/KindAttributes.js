import React, { PureComponent } from "react";
import { FormContext } from "helpers/contexts";
import Kind from "./kind";

export default class KindAttributes extends PureComponent {
  static displayName = "Resource.KindAttributes";

  render() {
    return (
      <FormContext.Consumer>
        {formProps => {
          const props = { ...this.props, ...formProps };

          switch (formProps.getModelValue("attributes[kind]")) {
            case "image":
              return <Kind.Image {...props} />;
            case "video":
              return <Kind.Video {...props} />;
            case "audio":
              return <Kind.Audio {...props} />;
            case "interactive":
              return <Kind.Interactive {...props} />;
            case "link":
              return <Kind.Link {...props} />;
            case "spreadsheet":
              return <Kind.Spreadsheet {...props} />;
            case "document":
              return <Kind.Document {...props} />;
            case "presentation":
              return <Kind.Presentation {...props} />;
            case "pdf":
              return <Kind.Pdf {...props} />;
            case "file":
              return <Kind.File {...props} />;
            default:
              return null;
          }
        }}
      </FormContext.Consumer>
    );
  }
}

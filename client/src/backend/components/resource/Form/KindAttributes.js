import React, { PureComponent } from "react";
import Resource from "backend/components/resource";
import { FormContext } from "helpers/contexts";

export default class KindAttributes extends PureComponent {
  static displayName = "Resource.KindAttributes";

  render() {
    return (
      <FormContext.Consumer>
        {formProps => {
          const props = Object.assign({}, this.props, formProps);

          switch (formProps.getModelValue("attributes[kind]")) {
            case "image":
              return <Resource.Form.Kind.Image {...props} />;
            case "video":
              return <Resource.Form.Kind.Video {...props} />;
            case "audio":
              return <Resource.Form.Kind.Audio {...props} />;
            case "interactive":
              return <Resource.Form.Kind.Interactive {...props} />;
            case "link":
              return <Resource.Form.Kind.Link {...props} />;
            case "spreadsheet":
              return <Resource.Form.Kind.Spreadsheet {...props} />;
            case "document":
              return <Resource.Form.Kind.Document {...props} />;
            case "presentation":
              return <Resource.Form.Kind.Presentation {...props} />;
            case "pdf":
              return <Resource.Form.Kind.Pdf {...props} />;
            case "file":
              return <Resource.Form.Kind.File {...props} />;
            default:
              return null;
          }
        }}
      </FormContext.Consumer>
    );
  }
}

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { withTranslation } from "react-i18next";

class ResourceFormKindDocument extends PureComponent {
  static displayName = "Resource.Form.Kind.Document";

  static propTypes = {
    t: PropTypes.func
  };

  render() {
    return (
      <Form.Upload
        layout="square"
        label={this.props.t("resources.new.document_file")}
        accepts="document"
        readFrom="attributes[attachmentFileName]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }
}

export default withTranslation()(ResourceFormKindDocument);

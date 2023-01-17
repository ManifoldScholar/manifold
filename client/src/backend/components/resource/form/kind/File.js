import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { withTranslation } from "react-i18next";

class ResourceFormKindFile extends PureComponent {
  static displayName = "Resource.Form.Kind.File";

  static propTypes = {
    t: PropTypes.func
  };

  render() {
    return (
      <Form.Upload
        layout="square"
        label={this.props.t("resources.new.file")}
        accepts="all"
        readFrom="attributes[attachmentStyles][original]"
        fileNameFrom="attributes[attachmentFileName]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }
}

export default withTranslation()(ResourceFormKindFile);

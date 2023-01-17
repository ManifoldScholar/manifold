import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { withTranslation } from "react-i18next";

class ResourceFormKindPresentation extends PureComponent {
  static displayName = "Resource.Form.Kind.Presentation";

  static propTypes = {
    t: PropTypes.func
  };

  render() {
    return (
      <Form.Upload
        layout="square"
        label={this.props.t("resources.new.presentation_file")}
        accepts="presentation"
        readFrom="attributes[attachmentFileName]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }
}

export default withTranslation()(ResourceFormKindPresentation);

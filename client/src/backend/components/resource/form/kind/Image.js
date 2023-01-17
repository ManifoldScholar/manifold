import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { withTranslation } from "react-i18next";

class ResourceFormKindImage extends PureComponent {
  static displayName = "Resource.Form.Kind.Image";

  static propTypes = {
    t: PropTypes.func
  };

  render() {
    return (
      <Form.Upload
        layout="square"
        label={this.props.t("resources.new.image_file")}
        accepts="images"
        readFrom="attributes[attachmentStyles][small]"
        name="attributes[attachment]"
        remove="attributes[removeAttachment]"
        {...this.props}
      />
    );
  }
}

export default withTranslation()(ResourceFormKindImage);

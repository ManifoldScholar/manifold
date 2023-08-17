import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { withTranslation } from "react-i18next";

class ResourceFormKindInteractive extends PureComponent {
  static displayName = "Resource.Form.Kind.Interactive";

  static propTypes = {
    getModelValue: PropTypes.func,
    t: PropTypes.func
  };

  render() {
    return (
      <>
        <Form.TextInput
          label={this.props.t("resources.new.min_width")}
          placeholder={this.props.t("resources.new.min_width_placeholder")}
          name="attributes[minimumWidth]"
          instructions={this.props.t("resources.new.width_height_instructions")}
          {...this.props}
        />
        <Form.TextInput
          label={this.props.t("resources.new.min_height")}
          placeholder={this.props.t("resources.new.min_height_placeholder")}
          name="attributes[minimumHeight]"
          instructions={this.props.t("resources.new.width_height_instructions")}
          {...this.props}
        />
        <Form.TextInput
          label={this.props.t("resources.new.iframe_url")}
          name="attributes[externalUrl]"
          placeholder={this.props.t("resources.new.iframe_url_placeholder")}
          {...this.props}
        />
        <Form.SwitchArray
          name="attributes[iframeAllows]"
          options={[
            {
              label: this.props.t("resources.new.iframe_allow_fullscreen"),
              value: "fullscreen"
            },
            {
              label: this.props.t("resources.new.iframe_allow_camera"),
              value: "camera"
            }
          ]}
        />
      </>
    );
  }
}

export default withTranslation()(ResourceFormKindInteractive);

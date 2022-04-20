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
      <div className="form-section form-section--primary">
        <Form.TextInput
          label={this.props.t("backend.forms.resource.min_width")}
          placeholder={this.props.t(
            "backend.forms.resource.min_width_placeholder"
          )}
          name="attributes[minimumWidth]"
          {...this.props}
        />
        <Form.TextInput
          label={this.props.t("backend.forms.resource.min_height")}
          placeholder={this.props.t(
            "backend.forms.resource.min_height_placeholder"
          )}
          name="attributes[minimumHeight]"
          {...this.props}
        />
        <Form.TextInput
          label={this.props.t("backend.forms.resource.iframe_url")}
          name="attributes[externalUrl]"
          placeholder={this.props.t(
            "backend.forms.resource.iframe_url_placeholder"
          )}
          {...this.props}
        />
      </div>
    );
  }
}

export default withTranslation()(ResourceFormKindInteractive);

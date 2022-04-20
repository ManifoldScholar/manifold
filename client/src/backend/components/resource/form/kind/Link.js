import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { withTranslation } from "react-i18next";

class ResourceFormKindLink extends PureComponent {
  static displayName = "Resource.Form.Kind.Link";

  static propTypes = {
    t: PropTypes.func
  };

  render() {
    return (
      <div className="form-section form-section--primary">
        <Form.TextInput
          label={this.props.t("backend.forms.resource.link_url")}
          name="attributes[externalUrl]"
          placeholder={this.props.t(
            "backend.forms.resource.link_url_placeholder"
          )}
          {...this.props}
        />
      </div>
    );
  }
}

export default withTranslation()(ResourceFormKindLink);

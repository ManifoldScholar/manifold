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
      <Form.TextInput
        label={this.props.t("resources.new.link_url")}
        name="attributes[externalUrl]"
        placeholder={this.props.t("resources.new.link_url_placeholder")}
        {...this.props}
        wide
      />
    );
  }
}

export default withTranslation()(ResourceFormKindLink);

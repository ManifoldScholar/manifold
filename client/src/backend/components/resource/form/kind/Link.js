import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";

export default class ResourceFormKindLink extends PureComponent {
  static displayName = "Resource.Form.Kind.Link";

  static propTypes = {};

  render() {
    return (
      <div className="form-section form-section--primary">
        <Form.TextInput
          label="Link URL"
          name="attributes[externalUrl]"
          placeholder="Enter link URL"
          {...this.props}
        />
      </div>
    );
  }
}

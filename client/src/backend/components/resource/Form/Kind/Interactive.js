import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "backend/components/form";

export default class ResourceFormKindInteractive extends PureComponent {
  static displayName = "Resource.Form.Kind.Interactive";

  static propTypes = {
    getModelValue: PropTypes.func
  };

  render() {
    return (
      <div className="form-section">
        <Form.TextInput
          label="Minimum Width"
          placeholder="The minimum display width"
          name="attributes[minimumWidth]"
          {...this.props}
        />
        <Form.TextInput
          label="Minimum Height"
          placeholder="The minimum display height"
          name="attributes[minimumHeight]"
          {...this.props}
        />
        <Form.TextInput
          label="iFrame URL"
          name="attributes[externalUrl]"
          placeholder="Enter iFrame URL"
          {...this.props}
        />
      </div>
    );
  }
}

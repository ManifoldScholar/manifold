import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";

export default class SettingsPlaceholder extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired
  };

  render() {
    const label = this.props.label;
    return (
      <form className="form-secondary">
        <Form.TextInput
          label={`A ${label} setting`}
          name="attributes[aSetting]"
          placeholder="Some setting could go here"
        />
        <Form.TextInput
          label={`Another ${label} setting`}
          name="attributes[anotherSetting]"
          placeholder="Some other setting could go here"
        />
      </form>
    );
  }
}

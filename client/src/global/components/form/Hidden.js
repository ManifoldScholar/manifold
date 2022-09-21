import React, { Component } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import isNull from "lodash/isNull";

class FormHiddenInput extends Component {
  static displayName = "Form.HiddenInput";

  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func
  };

  render() {
    const value = isNull(this.props.value) ? "" : this.props.value;
    return (
      <div>
        <input type="hidden" value={value} onChange={this.props.onChange} />
      </div>
    );
  }
}

export default setter(FormHiddenInput);

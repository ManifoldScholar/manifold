import React, { Component, PropTypes } from 'react';
import setter from './setter';

class FormHiddenInput extends Component {

  static displayName = "Form.HiddenInput";

  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  render() {
    const value = this.props.value || "";
    return (
      <input
        type="hidden"
        value={value}
        onChange={this.props.onChange}
      />
    );
  }
}

export default setter(FormHiddenInput);

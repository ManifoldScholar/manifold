import React, { Component, PropTypes } from 'react';
import setter from './setter';
import isNull from 'lodash/isNull';

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
    const value = isNull(this.props.value) ? "" : this.props.value;
    return (
      <div className="form-input">
        <input
          type="hidden"
          value={value}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default setter(FormHiddenInput);

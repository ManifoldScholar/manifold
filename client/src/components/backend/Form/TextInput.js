import React, { Component, PropTypes } from 'react';

export default class TextInput extends Component {

  static displayName = "From.TextInput";

  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string
  };

  render() {
    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <input type="text" placeholder={this.props.placeholder} value={this.props.value} />
      </div>
    );
  }
}

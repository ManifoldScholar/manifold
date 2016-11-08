import React, { Component, PropTypes } from 'react';

export default class TextArea extends Component {

  static displayName = "From.TextArea";

  static propTypes = {
    label: PropTypes.string
  };

  render() {
    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <textarea />
      </div>
    );
  }

}

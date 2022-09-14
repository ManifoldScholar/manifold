import React, { Component } from "react";
import PropTypes from "prop-types";

export default class FormRadioLabel extends Component {
  static displayName = "Form.Radio.Label";

  static propTypes = {
    label: PropTypes.string.isRequired,
    prompt: PropTypes.string
  };

  get label() {
    return this.props.label;
  }

  get prompt() {
    return this.props.prompt;
  }

  render() {
    return (
      <legend className="form-input-radios__legend">
        {this.label && (
          <span className="form-input-radios__title" aria-hidden>
            {this.label}
          </span>
        )}
        {this.prompt && (
          <span className="form-input-radios__prompt">{this.prompt}</span>
        )}
      </legend>
    );
  }
}

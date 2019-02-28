import React, { Component } from "react";
import PropTypes from "prop-types";

export default class FormRadioLabel extends Component {
  static displayName = "Form.Radio.Label";

  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
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
      <React.Fragment>
        {this.label && <label htmlFor={this.props.id}>{this.label}</label>}
        {this.prompt && (
          <span className="form-input-radios__prompt">{this.prompt}</span>
        )}
      </React.Fragment>
    );
  }
}

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class FormRadioOption extends PureComponent {
  static displayName = "Form.Radio.Option";

  static propTypes = {
    value: PropTypes.any,
    inline: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    option: PropTypes.shape({
      value: PropTypes.any.isRequired,
      internalValue: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  };

  get option() {
    return this.props.option;
  }

  get checked() {
    return this.props.value === this.props.option.internalValue;
  }

  get inline() {
    return this.props.inline;
  }

  get inputClassNames() {
    return classnames("form-toggle", "radio", {
      checked: this.checked,
      inline: this.inline
    });
  }

  render() {
    return (
      <label className={this.inputClassNames}>
        <input
          type="radio"
          name={this.option.label}
          value={this.option.internalValue}
          checked={this.checked}
          onChange={this.props.onChange}
        />
        <span className="toggle-indicator" aria-hidden="true">
          {this.checked ? <i className="manicon" /> : null}
        </span>
        <span className="toggle-label">{this.option.label}</span>
      </label>
    );
  }
}

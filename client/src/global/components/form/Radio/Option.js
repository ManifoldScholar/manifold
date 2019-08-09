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
      internalValue: PropTypes.any.isRequired,
      instructions: PropTypes.string,
      label: PropTypes.string.isRequired
    }),
    focusOnMount: PropTypes.bool
  };

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement) {
      this.inputElement.focus();
    }
  }

  get option() {
    return this.props.option;
  }

  get instructions() {
    return this.option.instructions;
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
      <React.Fragment>
        <label className={this.inputClassNames}>
          <input
            type="radio"
            name={this.option.label}
            value={this.option.internalValue}
            checked={this.checked}
            onChange={this.props.onChange}
            ref={input => {
              this.inputElement = input;
            }}
          />
          <span className="toggle-indicator" aria-hidden="true" />
          <span className="toggle-label">{this.option.label}</span>
        </label>
        {this.instructions && !this.inline && (
          <span className="toggle-instructions">{this.instructions}</span>
        )}
      </React.Fragment>
    );
  }
}

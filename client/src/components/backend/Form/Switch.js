import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import setter from "./setter";

class FormSwitch extends Component {
  static displayName = "Form.Switch";

  static propTypes = {
    label: PropTypes.string,
    set: PropTypes.func,
    value: PropTypes.any,
    customValues: PropTypes.shape({
      true: PropTypes.string,
      false: PropTypes.string
    })
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  truthy(value) {
    return value === true || value === "true";
  }

  handleClick(event) {
    event.preventDefault();
    if (this.props.customValues) return this.handleCustomValues();
    return this.handleBooleans();
  }

  handleCustomValues() {
    const trueValue = this.props.customValues.true;
    const falseValue = this.props.customValues.false;
    if (this.props.value === trueValue) return this.props.set(falseValue);
    return this.props.set(trueValue);
  }

  handleBooleans() {
    this.props.set(!this.truthy(this.props.value));
  }

  determineChecked(value) {
    if (this.props.customValues) return value === this.props.customValues.true;
    return this.truthy(value);
  }

  render() {
    const classes = classnames({
      "boolean-primary": true,
      checked: this.determineChecked(this.props.value)
    });

    return (
      <div className="form-input">
        <label>
          {this.props.label}
        </label>
        <div className="toggle-indicator">
          {/* Add .checked to .boolean-primary to change visual state */}
          <div onClick={this.handleClick} className={classes} />
        </div>
      </div>
    );
  }
}

export default setter(FormSwitch);

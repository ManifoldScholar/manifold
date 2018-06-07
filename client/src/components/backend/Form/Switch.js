import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import setter from "./setter";

class FormSwitch extends Component {
  static displayName = "Form.Switch";

  static propTypes = {
    label: PropTypes.string,
    labelPos: PropTypes.string,
    className: PropTypes.string,
    labelClass: PropTypes.string,
    set: PropTypes.func,
    value: PropTypes.any,
    customValues: PropTypes.shape({
      true: PropTypes.string,
      false: PropTypes.string
    })
  };

  static defaultProps = {
    labelPos: "above"
  };

  truthy(value) {
    return value === true || value === "true";
  }

  handleClick = event => {
    event.preventDefault();
    if (this.props.customValues) return this.handleCustomValues();
    return this.handleBooleans();
  };

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
    const checked = this.determineChecked(this.props.value);
    const classes = classnames({
      "boolean-primary": true,
      checked
    });

    const labelClasses = classnames(
      "form-input-heading",
      this.props.labelPos,
      this.props.labelClass
    );
    const wrapperClasses = classnames("form-input", this.props.className);
    const label = <h4 className={labelClasses}>{this.props.label}</h4>;

    return (
      <div className={wrapperClasses}>
        {this.props.labelPos === "above" ? label : null}
        <div className="toggle-indicator">
          {/* Add .checked to .boolean-primary to change visual state */}
          <div
            onClick={this.handleClick}
            className={classes}
            role="button"
            tabIndex="0"
            aria-pressed={checked}
          >
            <span className="screen-reader-text">{this.props.label}</span>
          </div>
        </div>
        {this.props.labelPos === "below" ? label : null}
      </div>
    );
  }
}

export default setter(FormSwitch);

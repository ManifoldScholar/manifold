import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { UID } from "react-uid";
import setter from "./setter";
import Instructions from "./Instructions";
import IconComposer from "global/components/utility/IconComposer";

class FormSwitch extends Component {
  static displayName = "Form.Switch";

  static propTypes = {
    label: PropTypes.string,
    labelPos: PropTypes.string,
    className: PropTypes.string,
    labelClass: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    set: PropTypes.func,
    value: PropTypes.any,
    customValues: PropTypes.shape({
      true: PropTypes.string,
      false: PropTypes.string
    }),
    focusOnMount: PropTypes.bool,
    submitOnChange: PropTypes.bool,
    wide: PropTypes.bool,
    theme: PropTypes.oneOf(["default", "checkbox"])
  };

  static defaultProps = {
    labelPos: "above",
    theme: "default",
    submitOnChange: false
  };

  componentDidMount() {
    if (this.props.focusOnMount && this.checkbox) {
      this.checkbox.focus();
    }
  }

  get labelClasses() {
    return classnames(
      "form-input-heading",
      "toggle",
      this.props.labelPos,
      this.props.labelClass
    );
  }

  get themeClasses() {
    return classnames({
      "form-switch": this.showSwitch,
      "checkbox checkbox--gray": this.showCheckbox,
      checked: this.checked
    });
  }

  get wrapperClasses() {
    return classnames(
      {
        "form-input": true,
        wide: this.props.wide
      },
      this.props.className
    );
  }

  get switchClasses() {
    return classnames({
      "boolean-primary": this.showSwitch,
      checked: this.checked
    });
  }

  get instructionClasses() {
    return classnames({
      "instructions--inline": this.showCheckbox
    });
  }

  get checked() {
    return this.determineChecked(this.props.value);
  }

  get idPrefix() {
    return "switch-input";
  }

  get idForInstructionsPrefix() {
    return "switch-input-instructions";
  }

  get showSwitch() {
    return this.props.theme === "default";
  }

  get showCheckbox() {
    return this.props.theme === "checkbox";
  }

  truthy(value) {
    return value === true || value === "true";
  }

  handleChange = () => {
    if (this.props.customValues) {
      this.handleCustomValues();
    } else {
      this.handleBooleans();
    }
    if (this.props.submitOnChange && this.props.triggerSubmit) {
      this.props.triggerSubmit();
    }
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

  renderSwitchIndicator() {
    return (
      <span className="toggle-indicator">
        <span className={this.switchClasses} aria-hidden="true" />
      </span>
    );
  }

  renderCheckboxIndicator() {
    return (
      <span className="checkbox__indicator" aria-hidden="true">
        <IconComposer
          icon="checkmark16"
          size="default"
          iconClass="checkbox__icon"
        />
      </span>
    );
  }

  renderLabelText() {
    return <span className={this.labelClasses}>{this.props.label}</span>;
  }

  render() {
    return (
      <UID>
        {id => (
          <div className={this.wrapperClasses}>
            <label
              htmlFor={`${this.idPrefix}-${id}`}
              className={this.themeClasses}
            >
              {this.props.labelPos === "above" && this.renderLabelText()}
              <input
                ref={c => {
                  this.checkbox = c;
                }}
                type="checkbox"
                id={`${this.idPrefix}-${id}`}
                checked={this.checked}
                onChange={eventIgnored => this.handleChange()}
              />
              {this.showCheckbox && this.renderCheckboxIndicator()}
              {this.showSwitch && this.renderSwitchIndicator()}
              {this.props.labelPos === "below" && this.renderLabelText()}
              <Instructions
                instructions={this.props.instructions}
                className={this.instructionClasses}
              />
            </label>
          </div>
        )}
      </UID>
    );
  }
}

export default setter(FormSwitch);

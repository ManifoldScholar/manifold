import React, { Component } from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import setter from "../setter";
import Instructions from "../Instructions";
import FieldWrapper from "../FieldWrapper";
import { FormContext } from "helpers/contexts";
import * as Styled from "./styles";

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
    theme: PropTypes.oneOf(["default", "checkbox"]),
    isPrimary: PropTypes.bool
  };

  static defaultProps = {
    labelPos: "above",
    theme: "default",
    submitOnChange: false
  };

  static contextType = FormContext;

  componentDidMount() {
    if (this.props.focusOnMount && this.checkbox) {
      this.checkbox.focus();
    }
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
    const Indicator =
      this.context?.styleType === "secondary" && !this.props.isPrimary
        ? Styled.IndicatorSwitchInnerSecondary
        : Styled.IndicatorSwitchInner;
    return (
      /* toggle-indicator does not seem to apply any styles here; used for customization by other parent components */
      <Styled.IndicatorSwitchOuter className="toggle-indicator">
        <Indicator aria-hidden="true" />
      </Styled.IndicatorSwitchOuter>
    );
  }

  renderCheckboxIndicator() {
    return (
      <Styled.IndicatorCheckbox aria-hidden="true">
        <Styled.IconCheckbox icon="checkmark16" size="default" />
      </Styled.IndicatorCheckbox>
    );
  }

  render() {
    const Label = this.showSwitch ? Styled.LabelSwitch : Styled.LabelCheckbox;
    const LabelText =
      this.context?.styleType === "secondary" && !this.props.isPrimary
        ? Styled.LabelTextSecondary
        : Styled.LabelTextPrimary;
    const Input = this.showSwitch ? Styled.InputSwitch : Styled.InputCheckbox;

    return (
      <UIDConsumer>
        {id => (
          <FieldWrapper
            className={
              this.props.wide
                ? `wide ${this.props.className}`
                : this.props.className
            }
          >
            <Label htmlFor={`${this.idPrefix}-${id}`}>
              {this.props.labelPos === "above" && (
                <LabelText $marginEnd={this.props.isPrimary}>
                  {this.props.label}
                </LabelText>
              )}
              <Input
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
              {this.props.labelPos === "below" && (
                <LabelText>{this.props.label}</LabelText>
              )}
              <Instructions
                instructions={this.props.instructions}
                className={this.showCheckbox ? "inline" : undefined}
              />
            </Label>
          </FieldWrapper>
        )}
      </UIDConsumer>
    );
  }
}

export default setter(FormSwitch);

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default class FormRadioOption extends PureComponent {
  static displayName = "Form.Radio.Option";

  static propTypes = {
    value: PropTypes.any,
    inline: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    option: PropTypes.shape({
      value: PropTypes.any.isRequired,
      instructions: PropTypes.string,
      label: PropTypes.string.isRequired
    }),
    focusOnMount: PropTypes.bool,
    tabIndex: PropTypes.number,
    groupName: PropTypes.string.isRequired
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
    return this.props.value === this.props.option.originalValue;
  }

  get inline() {
    return this.props.inline;
  }

  get tabIndex() {
    return this.props.tabIndex || 0;
  }

  render() {
    return (
      <>
        <Styled.WrapperLabel $inline={this.inline}>
          <Styled.RadioInput
            type="radio"
            name={this.props.groupName}
            value={this.option.value}
            checked={this.checked}
            onChange={this.props.onChange}
            ref={input => {
              this.inputElement = input;
            }}
          />
          <Styled.RadioToggle aria-hidden="true" />
          <Styled.ToggleLabel>{this.option.label}</Styled.ToggleLabel>
        </Styled.WrapperLabel>
        {this.instructions && !this.inline && (
          <Styled.Instructions>{this.instructions}</Styled.Instructions>
        )}
      </>
    );
  }
}

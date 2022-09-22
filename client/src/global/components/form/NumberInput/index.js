import React, { Component } from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import isNull from "lodash/isNull";
import isUndefined from "lodash/isUndefined";
import * as Styled from "./styles";

export default class FormNumberInput extends Component {
  static displayName = "Form.NumberInput";

  static propTypes = {
    placeholder: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    afterChange: PropTypes.func,
    value: PropTypes.any,
    focusOnMount: PropTypes.bool,
    errors: PropTypes.array,
    wide: PropTypes.bool
  };

  static defaultProps = {
    focusOnMount: false
  };

  get idPrefix() {
    return "number-input";
  }

  get idForErrorPrefix() {
    return "number-input-error";
  }

  get idForInstructionsPrefix() {
    return "number-input-instructions";
  }

  renderValue = value => {
    if (isNull(value) || isUndefined(value)) return "";
    return value;
  };

  render() {
    return (
      <UIDConsumer>
        {id => (
          <Styled.NumberInput
            {...this.props}
            id={`${this.idPrefix}-${id}`}
            idForError={`${this.idForErrorPrefix}-${id}`}
            idForInstructions={`${this.idForInstructionsPrefix}-${id}`}
            inputType="number"
            renderValue={this.renderValue}
          />
        )}
      </UIDConsumer>
    );
  }
}

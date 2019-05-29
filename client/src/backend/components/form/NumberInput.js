import React, { Component } from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";
import BaseInput from "./BaseInput";
import isNull from "lodash/isNull";
import isUndefined from "lodash/isUndefined";

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

  renderValue = value => {
    if (isNull(value) || isUndefined(value)) return "";
    return value;
  };

  render() {
    return (
      <UID>
        {id => (
          <BaseInput
            {...this.props}
            inputClasses="form-number-input"
            id={`${this.idPrefix}-${id}`}
            idForError={`${this.idForErrorPrefix}-${id}`}
            inputType="number"
            renderValue={this.renderValue}
          />
        )}
      </UID>
    );
  }
}

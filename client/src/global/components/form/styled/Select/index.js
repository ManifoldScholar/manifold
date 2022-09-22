import React, { Component } from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import Errorable from "../Errorable";
import Instructions from "../Instructions";
import withFormOptions from "hoc/withFormOptions";
import BaseLabel from "../BaseLabel";
import FieldWrapper from "../FieldWrapper";
import { FormContext } from "helpers/contexts";
import * as Styled from "./styles";

class FormSelect extends Component {
  static displayName = "Form.Select";

  static propTypes = {
    value: PropTypes.any,
    errors: PropTypes.array,
    label: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    rounded: PropTypes.bool,
    name: PropTypes.string,
    wide: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired
      })
    ).isRequired,
    focusOnMount: PropTypes.bool
  };

  static defaultProps = {
    rounded: false
  };

  static contextType = FormContext;

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement) {
      this.inputElement.focus();
    }
  }

  get idPrefix() {
    return "select";
  }

  get idForErrorPrefix() {
    return "select-error";
  }

  get idForInstructionsPrefix() {
    return "select-instructions";
  }

  render() {
    const options = this.props.options.map(option => {
      return (
        <option key={option.key} value={option.value}>
          {option.label}
        </option>
      );
    });

    const styleType = this.context.styleType;

    const WrapperTag =
      styleType === "primary" ? Styled.PrimarySelectWrapper : "div";

    const SelectComponent = this.props.rounded
      ? Styled.TertiarySelect
      : styleType === "primary"
      ? Styled.PrimarySelect
      : Styled.SecondarySelect;

    const IconComponent = this.props.rounded
      ? Styled.IconTertiary
      : Styled.Icon;

    return (
      <UIDConsumer>
        {id => (
          <FieldWrapper className="wide">
            <Errorable
              name={this.props.name}
              errors={this.props.errors}
              label={this.props.label}
              idForError={`${this.idForErrorPrefix}-${id}`}
            >
              <BaseLabel
                id={`${this.idPrefix}-${id}`}
                styleType={this.props.rounded ? "tertiary" : styleType}
                label={this.props.label}
                isSelect
              />
              <WrapperTag>
                <IconComponent icon="disclosureDown24" size={24} />
                <SelectComponent
                  id={`${this.idPrefix}-${id}`}
                  aria-describedby={`${this.idForErrorPrefix}-${id} ${this.idForInstructionsPrefix}-${id}`}
                  onChange={this.props.onChange}
                  value={this.props.optionsMeta.stringValue}
                  ref={input => {
                    this.inputElement = input;
                  }}
                >
                  {options}
                </SelectComponent>
              </WrapperTag>
              <Instructions
                instructions={this.props.instructions}
                id={`${this.idForInstructionsPrefix}-${id}`}
              />
            </Errorable>
          </FieldWrapper>
        )}
      </UIDConsumer>
    );
  }
}

export default withFormOptions(FormSelect);

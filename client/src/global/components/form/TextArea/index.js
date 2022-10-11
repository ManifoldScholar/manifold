import React, { Component } from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import { FormContext } from "helpers/contexts";
import setter from "../setter";
import Errorable from "../Errorable";
import isString from "lodash/isString";
import Instructions from "../Instructions";
import BaseLabel from "../BaseLabel";
import * as Styled from "./styles";

export class FormTextArea extends Component {
  static displayName = "Form.TextArea";

  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    height: PropTypes.number,
    onChange: PropTypes.func,
    value: PropTypes.string,
    errors: PropTypes.array,
    name: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    wide: PropTypes.bool
  };

  static defaultProps = {
    height: 100
  };

  static contextType = FormContext;

  get idPrefix() {
    return "textarea";
  }

  get idForErrorPrefix() {
    return "textarea-error";
  }

  get idForInstructionsPrefix() {
    return "textarea-instructions";
  }

  render() {
    const TextAreaInput =
      this.context?.styleType === "secondary"
        ? Styled.TextAreaSecondary
        : Styled.TextAreaPrimary;

    return (
      <UIDConsumer>
        {id => (
          <Errorable
            name={this.props.name}
            errors={this.props.errors}
            label={this.props.label}
            idForError={`${this.idForErrorPrefix}-${id}`}
            className={this.props.wide ? "wide" : undefined}
          >
            <BaseLabel
              id={`${this.idPrefix}-${id}`}
              hasInstructions={isString(this.props.instructions)}
              label={this.props.label}
              styleType={this.context?.styleType}
            />
            {this.props.instructions && (
              <Instructions
                instructions={this.props.instructions}
                id={`${this.idForInstructionsPrefix}-${id}`}
              />
            )}
            <TextAreaInput
              id={`${this.idPrefix}-${id}`}
              name={this.props.name}
              aria-describedby={`${this.idForErrorPrefix}-${id} ${this.idForInstructionsPrefix}-${id}`}
              style={{ height: this.props.height }}
              placeholder={this.props.placeholder}
              onChange={this.props.onChange}
              value={this.props.value || ""}
            />
          </Errorable>
        )}
      </UIDConsumer>
    );
  }
}

export default setter(FormTextArea);

import React, { Component } from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import Errorable from "global/components/form/Errorable";
import Option from "../Radio/Option";
import RadioLabel from "../Radio/Label";
import classnames from "classnames";
import isString from "lodash/isString";
import Instructions from "../Instructions";
import withFormOptions from "hoc/withFormOptions";
import * as Styled from "./styles";

class FormRadios extends Component {
  static displayName = "Form.Radios";

  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
        instructions: PropTypes.string
      })
    ).isRequired,
    label: PropTypes.string,
    prompt: PropTypes.string,
    inline: PropTypes.bool,
    name: PropTypes.string,
    value: PropTypes.any,
    set: PropTypes.func,
    beforeOnChange: PropTypes.func,
    inputClasses: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    focusOnMount: PropTypes.bool
  };

  static defaultProps = {
    focusOnMount: false
  };

  get focusOnMount() {
    return this.props.focusOnMount;
  }

  get options() {
    return this.props.options;
  }

  get optionProps() {
    return {
      inline: this.props.inline,
      onChange: this.props.onChange,
      value: this.props.value
    };
  }

  get inputClasses() {
    return classnames(this.props.inputClasses, {
      "extra-space-bottom": true,
      wide: this.props.wide
    });
  }

  get idPrefix() {
    return "radios";
  }

  get idForErrorPrefix() {
    return "radios-error";
  }

  get idForInstructionsPrefix() {
    return "radios-instructions";
  }

  render() {
    return (
      <UIDConsumer>
        {id => (
          <Errorable
            className={this.inputClasses}
            name={this.props.name}
            errors={this.props.errors}
            label={this.props.label}
            idForError={`${this.idForErrorPrefix}-${id}`}
          >
            <Styled.RadiosWrapper
              aria-describedby={`${this.idForErrorPrefix}-${id} ${this.idForInstructionsPrefix}-${id}`}
            >
              <RadioLabel
                label={this.props.label}
                prompt={this.props.prompt}
                hasInstructions={isString(this.props.instructions)}
              />
              <Instructions
                instructions={this.props.instructions}
                id={`${this.idForInstructionsPrefix}-${id}`}
              />
              {this.options.map((option, index) => (
                <Option
                  key={option.key}
                  option={option}
                  focusOnMount={this.focusOnMount && index === 0}
                  groupName={`${this.idPrefix}-${id}`}
                  {...this.optionProps}
                />
              ))}
            </Styled.RadiosWrapper>
          </Errorable>
        )}
      </UIDConsumer>
    );
  }
}

export default withFormOptions(FormRadios);

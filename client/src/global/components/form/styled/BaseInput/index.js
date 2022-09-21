import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import Errorable from "global/components/form/Errorable";
import classnames from "classnames";
import isString from "lodash/isString";
import Instructions from "./Instructions";
import BaseLabel from "./BaseLabel";
import * as Styled from "./styles";

class FormBaseInput extends PureComponent {
  static displayName = "Form.BaseInput";

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
    inputType: PropTypes.string,
    inputClasses: PropTypes.string,
    join: PropTypes.func,
    id: PropTypes.string,
    idForError: PropTypes.string,
    idForInstructions: PropTypes.string,
    renderValue: PropTypes.func,
    wide: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = { notification: null };
  }

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement) {
      this.inputElement.focus();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  renderButtons(buttons) {
    return (
      <Styled.ActionGroup>
        {buttons.map(button => (
          <Styled.Action
            type="button"
            key={button.label}
            onClick={event =>
              button.onClick(
                event,
                this.inputElement,
                this.notify,
                this.props.set
              )
            }
          >
            {button.label}
          </Styled.Action>
        ))}
      </Styled.ActionGroup>
    );
  }

  notify = notification => {
    this.setState({ notification });
    this.timeout = setTimeout(() => {
      this.setState({ notification: null });
    }, 5000);
  };

  renderValue(props) {
    if (!props.renderValue) return props.value;
    return props.renderValue(props.value);
  }

  render() {
    const {
      id,
      idForError,
      idForInstructions,
      buttons,
      instructions,
      wide
    } = this.props;

    const fieldClasses = classnames(this.props.inputClasses, {
      wide
    });

    const InputComponent =
      context === "primary" ? Styled.PrimaryInput : Styled.SecondaryInput;

    return (
      <Errorable
        className={fieldClasses}
        name={this.props.name}
        errors={this.props.errors}
        label={this.props.label}
        idForError={idForError}
      >
        <BaseLabel
          id={id}
          label={this.props.label}
          hasInstructions={isString(instructions)}
        />
        <InputComponent
          ref={input => {
            this.inputElement = input;
          }}
          id={id}
          disabled={this.props.isDisabled}
          type={this.props.inputType}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          value={this.renderValue(this.props)}
          aria-describedby={`${idForError} ${idForInstructions}`}
        />
        {buttons && this.renderButtons(buttons)}
        <Instructions
          instructions={this.props.instructions}
          id={idForInstructions}
          withActions={!!buttons}
        />
        {this.state.notification && (
          <>
            {!this.props.instructions && <span />}
            <Styled.Notification>{this.state.notification}</Styled.Notification>
          </>
        )}
      </Errorable>
    );
  }
}

export default setter(FormBaseInput);

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import setter from "../setter";
import Errorable from "global/components/form/Errorable";
import classnames from "classnames";
import isString from "lodash/isString";
import Instructions from "../Instructions";
import BaseLabel from "../BaseLabel";
import { FormContext } from "helpers/contexts";
import * as Styled from "./styles";

export class FormBaseInput extends PureComponent {
  static displayName = "Form.BaseInput";

  static propTypes = {
    placeholder: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    label: PropTypes.string,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    onChange: PropTypes.func,
    afterChange: PropTypes.func,
    value: PropTypes.any,
    focusOnMount: PropTypes.bool,
    errors: PropTypes.array,
    inputType: PropTypes.string,
    type: PropTypes.string,
    autoComplete: PropTypes.string,
    className: PropTypes.string,
    join: PropTypes.func,
    id: PropTypes.string,
    idForError: PropTypes.string,
    errorName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    idForInstructions: PropTypes.string,
    renderValue: PropTypes.func,
    wide: PropTypes.bool,
    defaultValue: PropTypes.string
  };

  static contextType = FormContext;

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
    const secondary = this.context?.styleType === "secondary";
    return (
      <Styled.ActionGroup $secondary={secondary}>
        {buttons.map(button => (
          <Styled.Action
            $secondary={secondary}
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
    if (!props.renderValue) return props.value ?? undefined;
    return props.renderValue(props.value);
  }

  render() {
    const {
      id,
      idForError,
      idForInstructions,
      buttons,
      instructions,
      wide,
      className
    } = this.props;

    const fieldClasses = classnames(className, {
      wide
    });
    const Wrapper = buttons ? Styled.WrapperWithActions : Errorable;

    const InputComponent =
      this.context?.styleType === "secondary"
        ? Styled.SecondaryInput
        : Styled.PrimaryInput;

    return (
      <Wrapper
        className={buttons ? undefined : fieldClasses}
        name={this.props.errorName ?? this.props.name}
        errors={this.props.errors}
        label={this.props.label}
        idForError={idForError}
      >
        <BaseLabel
          id={id}
          label={this.props.label}
          hasInstructions={isString(instructions)}
          styleType={this.context?.styleType}
        />
        <InputComponent
          ref={input => {
            this.inputElement = input;
          }}
          id={id}
          name={this.props.name}
          disabled={this.props.isDisabled}
          type={this.props.inputType ?? this.props.type}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          onKeyDown={e => {
            if (this.props.onKeyDown)
              this.props.onKeyDown(e, this.inputElement);
          }}
          value={this.renderValue(this.props)}
          aria-describedby={`${idForError || ""} ${idForInstructions || ""}`}
          autoComplete={this.props.autoComplete}
          defaultValue={this.props.defaultValue}
        />
        {buttons && this.renderButtons(buttons)}
        {this.props.instructions && (
          <Instructions
            instructions={this.props.instructions}
            id={idForInstructions}
            withActions={!!buttons}
          />
        )}
        {this.state.notification && (
          <>
            {!this.props.instructions && <span />}
            <Styled.Notification>{this.state.notification}</Styled.Notification>
          </>
        )}
      </Wrapper>
    );
  }
}

export default setter(FormBaseInput);

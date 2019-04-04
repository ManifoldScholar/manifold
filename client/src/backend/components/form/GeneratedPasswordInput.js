import React, { Component } from "react";
import PropTypes from "prop-types";
import labelId from "helpers/labelId";
import setter from "./setter";
import GlobalForm from "global/components/form";
import generatePassword from "helpers/passwordGenerator";
import IconComposer from "global/components/utility/IconComposer";

class FormGeneratedPasswordInput extends Component {
  static displayName = "Form.GeneratedPasswordInput";

  static propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
    focusOnMount: PropTypes.bool,
    errors: PropTypes.array,
    set: PropTypes.func,
    id: PropTypes.string,
    idForError: PropTypes.string
  };

  static defaultProps = {
    focusOnMount: false,
    id: labelId("generated-password-"),
    idForError: labelId("generated-password-error-")
  };

  constructor(props) {
    super(props);
    this.state = {
      password: this.initializePassword(),
      showPassword: false
    };
  }

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement)
      this.inputElement.focus();
    this.setValueFromCurrentState();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state !== prevState) this.setValueFromCurrentState();
  }

  setValueFromCurrentState() {
    const password = this.state.password;
    const { set } = this.props;
    set(password, false);
  }

  togglePassword(event) {
    event.preventDefault();
    this.setState({ showPassword: !this.state.showPassword });
  }

  initializePassword() {
    return generatePassword();
  }

  handlePasswordChange(event) {
    event.preventDefault();
    const value = event.target.value;
    this.setState({ password: value });
  }

  renderInput() {
    const type = this.state.showPassword ? "text" : "password";

    return (
      <input
        ref={input => {
          this.inputElement = input;
        }}
        id={this.props.id}
        aria-describedby={this.props.idForError}
        type={type}
        placeholder={"Enter a password"}
        onChange={event => this.handlePasswordChange(event)}
        value={this.state.password}
      />
    );
  }

  render() {
    const icon = !this.state.showPassword ? "eyeClosed32" : "eyeOpen32";

    return (
      <GlobalForm.Errorable
        className="form-input password-input"
        name={this.props.name}
        errors={this.props.errors}
        label="Password"
        idForError={this.props.idForError}
      >
        <label htmlFor={this.props.id}>Password</label>
        <span
          className="password-input__visibility-toggle"
          onClick={event => this.togglePassword(event)}
          role="button"
          tabIndex="0"
        >
          <IconComposer
            icon={icon}
            size="default"
            iconClass="password-input__visibility-icon"
          />
          <span className="screen-reader-text">
            {this.state.showPassword ? "hide password" : "show password"}
          </span>
        </span>
        {this.renderInput()}
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormGeneratedPasswordInput);

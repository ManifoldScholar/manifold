import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { UIDConsumer } from "react-uid";
import setter from "./setter";
import Errorable from "global/components/form/Errorable";
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
    t: PropTypes.func
  };

  static defaultProps = {
    focusOnMount: false
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

  get idPrefix() {
    return "generated-password";
  }

  get idForErrorPrefix() {
    return "generated-password-error";
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

  renderInput(id) {
    const type = this.state.showPassword ? "text" : "password";

    return (
      <input
        ref={input => {
          this.inputElement = input;
        }}
        id={`${this.idPrefix}-${id}`}
        aria-describedby={this.props.idForError}
        type={type}
        placeholder={this.props.t("forms.password_reset.enter_password")}
        onChange={event => this.handlePasswordChange(event)}
        value={this.state.password}
      />
    );
  }

  render() {
    const icon = !this.state.showPassword ? "eyeClosed32" : "eyeOpen32";
    const t = this.props.t;

    return (
      <UIDConsumer>
        {id => (
          <Errorable
            className="form-input password-input"
            name={this.props.name}
            errors={this.props.errors}
            label={t("forms.password_reset.password")}
            idForError={`${this.idForErrorPrefix}-${id}`}
          >
            <label htmlFor={`${this.idPrefix}-${id}`}>
              {t("forms.password_reset.password")}
            </label>
            <span
              className="password-input__visibility-toggle"
              onClick={event => this.togglePassword(event)}
              role="button"
              tabIndex="0"
            >
              <IconComposer
                icon={icon}
                size="default"
                className="password-input__visibility-icon"
              />
              <span className="screen-reader-text">
                {this.state.showPassword
                  ? t("forms.password_reset.hide_password")
                  : t("forms.password_reset.show_password")}
              </span>
            </span>
            {this.renderInput(id)}
          </Errorable>
        )}
      </UIDConsumer>
    );
  }
}

export default withTranslation()(setter(FormGeneratedPasswordInput));

import React, { Component } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import classnames from "classnames";
import { Form as GlobalForm } from "components/global";
import generatePassword from "helpers/passwordGenerator";

class FormGeneratedPasswordInput extends Component {
  static displayName = "Form.GeneratedPasswordInput";

  static propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
    focusOnMount: PropTypes.bool,
    errors: PropTypes.array,
    set: PropTypes.func
  };

  static defaultProps = {
    focusOnMount: false
  };

  constructor(props) {
    super(props);
    this.state = {
      password: "",
      showPassword: false
    };
  }

  componentWillMount() {
    this.setState({ password: this.initializePassword() });
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
    // const inputClass = classnames({
    //   hidden: !this.state.showPassword
    // });
    //
    const type = this.state.showPassword ? "text" : "password";
    return (
      <input
        ref={input => {
          this.inputElement = input;
        }}
        type={type}
        placeholder={"Enter a password"}
        onChange={event => this.handlePasswordChange(event)}
        value={this.state.password}
      />
    );
  }

  render() {
    const iconClass = classnames({
      manicon: true,
      "manicon-eye-outline": !this.state.showPassword,
      "manicon-eye-slash": this.state.showPassword
    });

    return (
      <GlobalForm.Errorable
        className="form-input password-input"
        name={this.props.name}
        errors={this.props.errors}
        label="Password"
      >
        <label>Password</label>
        <span
          className="password-visibility-toggle"
          onClick={event => this.togglePassword(event)}
        >
          <i className={iconClass} />
        </span>
        {this.renderInput()}
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormGeneratedPasswordInput);

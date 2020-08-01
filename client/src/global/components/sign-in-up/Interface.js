import React, { Component } from "react";
import PropTypes from "prop-types";
import PasswordForgot from "./PasswordForgot";
import Login from "./Login";
import Logout from "./Logout";
import CreateUpdate from "./CreateUpdate";
import Update from "./Update";
import Create from "./Create";
import { withRouter } from "react-router-dom";

class SignInUpInterface extends Component {
  static propTypes = {
    withoutAccountUpdate: PropTypes.bool,
    defaultToSignUp: PropTypes.bool,
    hideSignInUpOverlay: PropTypes.func,
    authentication: PropTypes.object,
    settings: PropTypes.object,
    dispatch: PropTypes.func
  };

  static defaultProps = {
    hideSignInUpOverlay: () => {},
    withoutAccountUpdate: false,
    defaultToSignUp: false
  };

  constructor(props) {
    super(props);
    this.state = {
      view: this.defaultView(props)
    };
  }

  defaultView(props) {
    const { authenticated } = props.authentication;
    const { withoutAccountUpdate, defaultToSignUp } = props;
    if (authenticated) {
      if (withoutAccountUpdate) {
        return "account-logout";
      } else {
        return "account-update";
      }
    } else {
      if (defaultToSignUp) return "account-create";
      return "account-login";
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.authentication.authenticated &&
      !prevProps.authentication.authenticated
    ) {
      if (this.props.withoutAccountUpdate) {
        this.updateView("account-logout");
      }
      if (
        (this.props.authentication.authenticated && this.willRedirect) ||
        this.state.view !== "account-create-update"
      ) {
        this.props.hideSignInUpOverlay();
      }
    }
  }

  get willRedirect() {
    if (!this.props.location || !this.props.location.state) return false;
    return Boolean(this.props.location.state.postLoginRedirect);
  }

  updateView = (view, event = null) => {
    if (event) event.preventDefault();
    this.setState(Object.assign(this.state, {}, { view }));
  };

  childProps = () => {
    return {
      handleViewChange: this.updateView,
      redirectToHomeOnSignup: this.props.defaultToSignUp,
      history: this.props.history,
      settings: this.props.settings,
      dispatch: this.props.dispatch,
      location: this.props.location,
      willRedirect: this.willRedirect,
      hideSignInUpOverlay: this.props.hideSignInUpOverlay,
      authentication: this.props.authentication
    };
  };

  render() {
    let child = null;
    const childProps = this.childProps();
    switch (this.state.view) {
      case "account-create":
        child = <Create {...childProps} />;
        break;
      case "account-update":
        child = <Update {...childProps} />;
        break;
      case "account-create-update":
        child = <CreateUpdate {...childProps} />;
        break;
      case "account-password-forgot":
        child = <PasswordForgot {...childProps} />;
        break;
      case "account-login":
        child = <Login {...childProps} />;
        break;
      case "account-logout":
        child = <Logout {...childProps} />;
        break;
      default:
        child = null;
        break;
    }
    return child;
  }
}

export default withRouter(SignInUpInterface);

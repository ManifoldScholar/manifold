import React, { Component } from "react";
import PropTypes from "prop-types";
import FocusTrap from "focus-trap-react";
import Utility from "global/components/utility";
import PasswordForgot from "./PasswordForgot";
import Login from "./Login";
import CreateUpdate from "./CreateUpdate";
import Update from "./Update";
import Create from "./Create";
import { withRouter } from "react-router-dom";

import BodyClass from "hoc/body-class";

class Overlay extends Component {
  static propTypes = {
    hideSignInUpOverlay: PropTypes.func,
    authentication: PropTypes.object,
    settings: PropTypes.object,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      view: props.authentication.authenticated
        ? "account-update"
        : "account-login"
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.authentication.authenticated &&
      !prevProps.authentication.authenticated
    ) {
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
      settings: this.props.settings,
      dispatch: this.props.dispatch,
      location: this.props.location,
      willRedirect: this.willRedirect,
      hideSignInUpOverlay: this.props.hideSignInUpOverlay,
      authentication: this.props.authentication
    };
  };

  renderChild() {
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
      default:
        child = null;
        break;
    }
    return child;
  }

  render() {
    return (
      <BodyClass className={"no-scroll"}>
        <div className="overlay-full-primary">
          <FocusTrap
            focusTrapOptions={{
              onDeactivate: this.props.hideSignInUpOverlay
            }}
          >
            <header className="overlay-header">
              <div className="container">
                <div className="rel">
                  <figure className="header-logo" aria-hidden="true">
                    <Utility.IconComposer size={26} icon="manifoldLogo32" />
                  </figure>
                  <button
                    onClick={this.props.hideSignInUpOverlay}
                    className="overlay-close"
                    data-id="overlay-close"
                  >
                    <span className="overlay-close__text">Cancel</span>
                    <Utility.IconComposer
                      size={56.889}
                      icon="close32"
                      iconClass="overlay-close__icon"
                    />
                  </button>
                </div>
              </div>
            </header>
            <div className="overlay-content focus">
              <div className="container">
                <div className="inner">{this.renderChild()}</div>
              </div>
            </div>
          </FocusTrap>
        </div>
      </BodyClass>
    );
  }
}

export default withRouter(Overlay);

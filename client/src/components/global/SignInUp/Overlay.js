import React, { Component } from "react";
import PropTypes from "prop-types";
import { HigherOrder } from "components/global";
import PasswordForgot from "./PasswordForgot";
import Login from "./Login";
import CreateUpdate from "./CreateUpdate";
import Update from "./Update";
import Create from "./Create";

export default class Overlay extends Component {
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
    this.updateView = this.updateView.bind(this);
    this.childProps = this.childProps.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.authentication.authenticated === false &&
      nextProps.authentication.authenticated === true
    ) {
      if (this.state.view !== "account-create-update") {
        this.props.hideSignInUpOverlay();
      }
    }
  }

  updateView(view, event = null) {
    if (event) event.preventDefault();
    this.setState(Object.assign(this.state, {}, { view }));
  }

  childProps() {
    return {
      handleViewChange: this.updateView,
      settings: this.props.settings,
      dispatch: this.props.dispatch,
      hideSignInUpOverlay: this.props.hideSignInUpOverlay,
      authentication: this.props.authentication
    };
  }

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
      <HigherOrder.BodyClass className={"no-scroll"}>
        <div className="overlay-full-primary">
          <header className="overlay-header">
            <div className="container">
              <div className="rel">
                <figure className="logo">
                  <i className="manicon manicon-manifold-logo" />
                </figure>
                <button
                  onClick={this.props.hideSignInUpOverlay}
                  className="overlay-close"
                  data-id="overlay-close"
                >
                  Cancel
                  <i className="manicon manicon-x" />
                </button>
              </div>
            </div>
          </header>
          <div className="overlay-content focus">
            <div className="container">
              <div className="inner">
                {this.renderChild()}
              </div>
            </div>
          </div>
        </div>
      </HigherOrder.BodyClass>
    );
  }
}

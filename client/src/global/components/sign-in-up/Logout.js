import React, { Component } from "react";
import PropTypes from "prop-types";
import { currentUserActions } from "actions";
import classNames from "classnames";

export default class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    authentication: PropTypes.shape({
      currentUser: PropTypes.object
    })
  };

  static defaultProps = {
    hideSignInUpOverlay: () => {}
  };

  handleLogout = event => {
    event.preventDefault();
    const { dispatch } = this.props;
    const action = currentUserActions.logout();
    dispatch(action);
  };

  render() {
    if (!this.props.authentication.authenticated) return null;

    const submitClass = classNames({
      "form-input": true
    });

    return (
      <div style={{ minHeight: 250 }}>
        <form method="post" onSubmit={this.handleLogout}>
          <div className="row-1-p">
            You are logged in as{" "}
            {this.props.authentication.currentUser.attributes.fullName}.
          </div>
          <div className="row-1-p">
            <div className={submitClass}>
              <input
                className="button-secondary button-secondary--with-room"
                type="submit"
                value="Log out"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { currentUserActions } from "actions";

export class LoginContainer extends Component {
  static mapStateToProps(state) {
    return {
      authentication: state.authentication
    };
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    authentication: PropTypes.shape({
      authToken: PropTypes.string,
      currentUser: PropTypes.object,
      authenticated: PropTypes.bool
    })
  };

  handleLogout = event => {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(currentUserActions.logout());
  };

  loginUI = () => {
    return (
      <div className="container">
        <header className="rel">
          <h4 className="section-heading">
            <i className="manicon manicon-lamp" />
            {"Log In"}
          </h4>
        </header>
      </div>
    );
  };

  logoutUI = () => {
    const loginNotice = (
      <p className="login-notice">
        {`You are logged in as ${this.props.authentication.currentUser.email}`}
      </p>
    );
    return (
      <div className="container">
        <header className="rel">
          <h4 className="section-heading">
            <i className="manicon manicon-lamp" />
            {"Log Out"}
          </h4>
        </header>
        <form method="post" onSubmit={this.handleLogout}>
          {this.props.authentication.currentUser ? loginNotice : ""}
          <input type="submit" value="Log Out" className="button-secondary" />
        </form>
      </div>
    );
  };

  render() {
    const { authenticated } = this.props.authentication;
    return (
      <section className="login-page">
        {authenticated ? this.logoutUI() : this.loginUI()}
      </section>
    );
  }
}

export default connectAndFetch(LoginContainer);

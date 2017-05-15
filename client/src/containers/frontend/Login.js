import React, { Component, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { currentUserActions } from 'actions';

export class LoginContainer extends Component {

  static mapStateToProps(state) {
    return {
      authentication: state.authentication
    };
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    authentication: React.PropTypes.shape({
      authToken: React.PropTypes.string,
      currentUser: React.PropTypes.object,
      authenticated: React.PropTypes.bool
    })
  };

  handleLogout = (event) => {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(currentUserActions.logout());
  };

  loginUI = () => {
    return (
      <div className="container">
        <header className="rel">
          <h4 className="section-heading">
            <i className="manicon manicon-lamp"></i>
            {'Log In'}
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
            <i className="manicon manicon-lamp"></i>
            {'Log Out'}
          </h4>
        </header>
        <form method="post" onSubmit={this.handleLogout}>
          { this.props.authentication.currentUser ? loginNotice : ''}
          <input type="submit" value="Log Out" className="button-secondary" />
        </form>
      </div>
    );
  };

  render() {

    const { authenticated } = this.props.authentication;
    console.log(authenticated, 'auth');
    return (
      <section className="login-page">
        {authenticated ? this.logoutUI() : this.loginUI()}
      </section>
    );
  }
}

export default connectAndFetch(LoginContainer);

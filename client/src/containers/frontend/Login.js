import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoginForm } from 'containers/global';
import { authActions } from 'actions';

const { startLogout } = authActions;

class Login extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    authentication: React.PropTypes.shape({
      authToken: React.PropTypes.string,
      user: React.PropTypes.object
    })
  };

  handleLogout = (event) => {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(startLogout());
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
        <LoginForm />
      </div>
    );
  };

  logoutUI = () => {
    const loginNotice = (
      <p className="login-notice">
        {`You are logged in as ${this.props.authentication.user.email}`}
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
          { this.props.authentication.user ? loginNotice : ''}
          <input type="submit" value="Log Out" className="button-secondary" />
        </form>
      </div>
    );
  };

  render() {
    return (
      <section className="login-page">
        {this.props.authentication.authToken === null ? this.loginUI() : this.logoutUI()}
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication
  };
}

export default connect(
  mapStateToProps
)(Login);

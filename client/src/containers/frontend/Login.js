import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { startLogin, startLogout } from '../../actions/shared/authentication';

class Login extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    authentication: React.PropTypes.shape({
      authToken: React.PropTypes.string,
      user: React.PropTypes.object
    })
  };

  // TODO: Remove this at some future point
  state = {email: 'admin@manifold.dev', password: 'manifold'};

  updatePassword = (event) => {
    this.setState(Object.assign({}, this.state, {password: event.target.value}));
  };

  updateEmail = (event) => {
    this.setState(Object.assign({}, this.state, {email: event.target.value}));
  };

  handleLogin = (event) => {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(startLogin(this.state.email, this.state.password));
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
            {'Login'}
          </h4>
        </header>
        <form method="post" onSubmit={this.handleLogin}>
          <label htmlFor="login-email">Email</label><br />
          <input value={this.state.email} onChange={this.updateEmail} id="login-email" type="text" /><br /><br />
          <label htmlFor="login-password">Password</label><br />
          <input value={this.state.password} onChange={this.updatePassword} id="login-password" type="password" /><br /><br />
          <input type="submit" value="Login" />
        </form>
      </div>
    );
  };

  logoutUI = () => {
    return (
      <div className="container">
        <header className="rel">
          <h4 className="section-heading">
            <i className="manicon manicon-lamp"></i>
            {'Logout'}
          </h4>
        </header>
        <form method="post" onSubmit={this.handleLogout}>
          { this.props.authentication.user ? <div style={{marginBottom: 20}}>{`You are logged in as ${this.props.authentication.user.email}`}</div> : ''}
          <input type="submit" value="Logout" />
        </form>
      </div>
    );
  };

  render = () => {
    return (
      <div>
        <section>
          {this.props.authentication.authToken === null ? this.loginUI() : this.logoutUI()}
        </section>
      </div>
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

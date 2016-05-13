import React, { Component, PropTypes } from 'react';
import usersAPI from '../../../api/users';
import { request, flush } from '../../../actions/shared/entityStore';
import { select } from '../../../utils/entityUtils';
import { Errorable } from '../Form';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { startLogin } from '../../../actions/shared/authentication';

class Create extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    response: PropTypes.object,
    user: PropTypes.object,
    showForgot: PropTypes.func.isRequired,
    showLogin: PropTypes.func.isRequired,
    showUpdate: PropTypes.func.isRequired
  };

  static requests = {
    create: 'signinup-create-user'
  };

  static mapStateToProps(state) {
    const r = Create.requests;
    const myState = {
      user: select(r.create, state.entityStore),
      response: state.entityStore.responses[r.create]
    };
    return myState;
  }

  constructor() {
    super();
    this.createUser = this.createUser.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
    this.state = {
      authenticating: false,
      user: {
        email: `zach+${new Date().getMilliseconds()}@castironcoding.com`,
        name: 'Zach Davis',
        password: 'testtest123',
        passwordConfirmation: 'testtest123'
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && !this.props.user) {
      this.authenticateUser();
    }
    if (nextProps.authentication.authenticated) {
      this.props.showUpdate();
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(Create.requests));
  }

  authenticateUser() {
    this.setState({ authenticating: true });
    const { dispatch } = this.props;
    dispatch(startLogin(this.state.user.email, this.state.user.password));
  }

  createUser(event) {
    event.preventDefault(event.target);
    this.props.dispatch(request(usersAPI.create(this.state.user), Create.requests.create));
  }

  handleInputChange(event) {
    const user =
      Object.assign({}, this.state.user, { [event.target.name]: event.target.value });
    this.setState({ user });
  }

  render() {
    let errors = get(this.props.response, 'errors') || {};
    return (
      <div>
        <form method="post" onSubmit={this.createUser} >
          <h4 className="form-heading">Create Account</h4>
          <div className="row-1-p">
            <Errorable className="form-input" field="email" errors={errors} >
             <label>Email</label>
              <input
                value={this.state.user.email}
                type="text"
                name="email"
                id="create-email"
                onChange={this.handleInputChange}
                placeholder="Email"
              />
            </Errorable>
          </div>
          <div className="row-1-p">
            <Errorable
              className="form-input"
              field={['first_name', 'last_name']}
              errors={errors}
            >
              <label>
                Name
              </label>
              <input
                value={this.state.user.name}
                type="text"
                id="create-name"
                name="name"
                onChange={this.handleInputChange}
                placeholder="Name"
              />
            </Errorable>
          </div>
          <div className="row-1-p">
            <Errorable className="form-input" field="password" errors={errors} >
              <label>
                Password
              </label>
              <input
                value={this.state.user.password}
                type="password"
                name="password"
                id="create-password"
                onChange={this.handleInputChange}
                placeholder="password"
              />
            </Errorable>
          </div>
          <div className="row-1-p">
            <div className="form-input">
              <label>
                Confirm Password
              </label>
              <input
                value={this.state.user.passwordConfirmation}
                type="password"
                name="passwordConfirmation"
                id="create-password-confirmation"
                onChange={this.handleInputChange}
                placeholder="Confirm Password"
              />
            </div>
          </div>
          <div className="row-1-p">
            <div className="form-input">
              <input
                className="button-secondary button-with-room"
                type="submit"
                value="Create Account"
              />
            </div>
          </div>
        </form>
        <p className="login-links">
          {'You can also create a Manifold account using your Facebook or Twitter credentials.'}
        </p>
        <section className="login-external">
          <button className="button-secondary-dark">
            <i className="manicon manicon-facebook"></i>
            <span>Log in with Facebook</span>
          </button>
          <button className="button-secondary-dark">
            <i className="manicon manicon-twitter"></i>
            <span>Log in with Twitter</span>
          </button>
        </section>
        <p className="login-links">
          <a href="#" onClick={this.props.showLogin}>
            {'Already have an account?'}
          </a>
        </p>
        <p className="login-links">
          {'By creating this account, you agree to Manifold\'s terms and conditions.'}
        </p>

      </div>
    );
  }
}

const SignUpCreate = connect(
  Create.mapStateToProps
)(Create);
export default SignUpCreate;

import React, { Component } from "react";
import PropTypes from "prop-types";
import { usersAPI, requests } from "api";
import { entityStoreActions, currentUserActions } from "actions";
import { select } from "utils/entityUtils";
import { Form, SignInUp } from "components/global";
import { possessivize } from "utils/string";
import connectAndFetch from "utils/connectAndFetch";
import get from "lodash/get";
import find from "lodash/find";

const { request, flush } = entityStoreActions;

export class CreateContainer extends Component {
  static mapStateToProps = state => {
    const myState = {
      user: select(requests.gCreateUser, state.entityStore),
      pages: select(requests.gPages, state.entityStore),
      response: state.entityStore.responses[requests.gCreateUser]
    };
    return myState;
  };

  static propTypes = {
    dispatch: PropTypes.func,
    response: PropTypes.object,
    user: PropTypes.object,
    settings: PropTypes.object.isRequired,
    authentication: PropTypes.object,
    handleViewChange: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      authenticating: false,
      user: {
        email: "",
        name: "",
        password: "",
        passwordConfirmation: ""
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.user && this.props.user) {
      this.authenticateUser();
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.gCreateUser));
  }

  authenticateUser = () => {
    this.setState({ authenticating: true });
    const { dispatch } = this.props;
    dispatch(
      currentUserActions.login({
        email: this.state.user.email,
        password: this.state.user.password
      })
    );
  };

  createUser = event => {
    event.preventDefault(event.target);
    this.props
      .dispatch(
        request(
          usersAPI.create({ attributes: this.state.user }),
          requests.gCreateUser
        )
      )
      .promise.then(() => {
        this.props.handleViewChange("account-create-update");
      });
  };

  handleInputChange = event => {
    const user = Object.assign({}, this.state.user, {
      [event.target.name]: event.target.value
    });
    this.setState({ user });
  };

  renderTermsAndConditions(props) {
    const termsPage = find(
      props.pages,
      p => p.attributes.purpose === "terms_and_conditions"
    );
    if (!termsPage) return null;
    const attr = termsPage.attributes;
    const name = props.settings.attributes.general.installationName;

    const linkProps = attr.isExternalLink
      ? { href: attr.externalLink, target: "_blank" }
      : { href: `/page/${attr.slug}` };

    return (
      <p className="login-links">
        {`By creating this account, you agree to ${possessivize(name)} `}
        <a {...linkProps}>terms and conditions</a>
        {`.`}
      </p>
    );
  }

  render() {
    const errors = get(this.props.response, "errors") || [];
    return (
      <div>
        <form method="post" onSubmit={this.createUser}>
          <h4 className="form-heading">Create Account</h4>
          <div className="row-1-p">
            <Form.Errorable
              className="form-input"
              name="attributes[email]"
              errors={errors}
              idForError="create-email-error"
            >
              <label htmlFor="create-email">Email</label>
              <input
                value={this.state.user.email}
                type="text"
                name="email"
                id="create-email"
                aria-describedby="create-email-error"
                onChange={this.handleInputChange}
                placeholder="Email"
              />
            </Form.Errorable>
          </div>
          <div className="row-1-p">
            <Form.Errorable
              className="form-input"
              idForError="create-name-error"
              name={["attributes[firstName]", "attributes[lastName]"]}
              errors={errors}
            >
              <label htmlFor="create-name">Name</label>
              <input
                value={this.state.user.name}
                type="text"
                id="create-name"
                aria-describedby="create-name-error"
                name="name"
                onChange={this.handleInputChange}
                placeholder="Name"
              />
            </Form.Errorable>
          </div>
          <div className="row-1-p">
            <Form.Errorable
              className="form-input"
              idForError="create-password-error"
              name="attributes[password]"
              errors={errors}
            >
              <label htmlFor="create-password">Password</label>
              <input
                value={this.state.user.password}
                type="password"
                name="password"
                id="create-password"
                aria-describedby="create-password-error"
                onChange={this.handleInputChange}
                placeholder="Password"
              />
            </Form.Errorable>
          </div>
          <div className="row-1-p">
            <Form.Errorable
              className="form-input"
              idForError="create-password-confirmation-error"
              name="attributes[passwordConfirmation]"
              errors={errors}
            >
              <label htmlFor="create-password-confirmation">
                Confirm Password
              </label>
              <input
                value={this.state.user.passwordConfirmation}
                type="password"
                name="passwordConfirmation"
                id="create-password-confirmation"
                aria-describedby="create-password-confirmation-error"
                onChange={this.handleInputChange}
                placeholder="Confirm Password"
              />
            </Form.Errorable>
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
          {"You can also create a Manifold account using your Facebook, Twitter, or " +
            "Google credentials."}
        </p>
        <section className="login-external">
          <SignInUp.Oauth.Monitor dispatch={this.props.dispatch} />
          <SignInUp.Oauth.Button
            dispatch={this.props.dispatch}
            provider="facebook"
          >
            <span>Log in with Facebook</span>
          </SignInUp.Oauth.Button>
          <SignInUp.Oauth.Button
            dispatch={this.props.dispatch}
            provider="google"
            iconName="manicon-envelope"
          >
            <span>Log in with Google</span>
          </SignInUp.Oauth.Button>
          <SignInUp.Oauth.Button
            dispatch={this.props.dispatch}
            provider="twitter"
          >
            <span>Log in with Twitter</span>
          </SignInUp.Oauth.Button>
        </section>
        {this.renderTermsAndConditions(this.props)}
        <p className="login-links">
          <button
            onClick={event =>
              this.props.handleViewChange("account-login", event)
            }
            data-id="show-login"
          >
            {"Already have an account?"}
          </button>
        </p>
      </div>
    );
  }
}

export default connectAndFetch(CreateContainer);

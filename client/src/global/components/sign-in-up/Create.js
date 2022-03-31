import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation, Trans } from "react-i18next";
import { usersAPI, requests } from "api";
import { entityStoreActions, currentUserActions } from "actions";
import { select } from "utils/entityUtils";
import Form from "global/components/form";
import connectAndFetch from "utils/connectAndFetch";
import get from "lodash/get";
import find from "lodash/find";
import values from "lodash/values";
import capitalize from "lodash/capitalize";
import LoginExternal from "./LoginExternal";
import { has } from "lodash";
import { UIDConsumer } from "react-uid";

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
    handleViewChange: PropTypes.func.isRequired,
    t: PropTypes.func
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
    this.formRef = React.createRef();
  }

  componentDidMount() {
    if (this.formRef) this.formRef.focus();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.user && this.props.user) {
      this.authenticateUser();
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.gCreateUser));
  }

  get OAuthProviderNames() {
    const providers = values(
      get(this.props, "settings.attributes.oauth")
    ).filter(provider => provider.enabled);
    if (!providers || !providers.length) return null;
    const names = providers.map(provider => capitalize(provider.name));
    return names;
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
        if (!this.props.willRedirect && !this.props.redirectToHomeOnSignup)
          this.props.handleViewChange("account-create-update");
        if (
          this.props.redirectToHomeOnSignup &&
          !has(this.props.location, "state.postLoginRedirect")
        ) {
          this.props.history.replace(this.props.location, {
            postLoginRedirect: "/"
          });
        }
      });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    const adjustedValue = name === "email" ? value.trim() : value;

    const user = {
      ...this.state.user,
      [name]: adjustedValue
    };
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
        <Trans
          i18nKey="forms.signin_overlay.terms_and_conditions"
          components={[<a {...linkProps}>#</a>]}
          values={{ appName: name }}
        />
      </p>
    );
  }

  render() {
    const errors = get(this.props.response, "errors") || [];
    const installationName = this.props.settings.attributes.general
      .installationName;
    const t = this.props.t;

    return (
      <div>
        <UIDConsumer>
          {id => (
            <form
              method="post"
              onSubmit={this.createUser}
              aria-labelledby={id}
              tabIndex={-1}
              ref={el => (this.formRef = el)}
              className="focusable-form"
            >
              <h2 id={id} className="form-heading">
                {t("forms.signin_overlay.create_account")}
              </h2>
              <div className="row-1-p">
                <Form.Errorable
                  className="form-input"
                  name="attributes[email]"
                  errors={errors}
                  idForError="create-email-error"
                >
                  <label htmlFor="create-email">
                    {t("forms.signin_overlay.email")}
                  </label>
                  <input
                    value={this.state.user.email}
                    type="text"
                    name="email"
                    id="create-email"
                    aria-describedby="create-email-error"
                    onChange={this.handleInputChange}
                    placeholder={t("forms.signin_overlay.email")}
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
                  <label htmlFor="create-name">
                    {t("forms.signin_overlay.name")}
                  </label>
                  <input
                    value={this.state.user.name}
                    type="text"
                    id="create-name"
                    aria-describedby="create-name-error"
                    name="name"
                    onChange={this.handleInputChange}
                    placeholder={t("forms.signin_overlay.name")}
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
                  <label htmlFor="create-password">
                    {t("forms.signin_overlay.password")}
                  </label>
                  <input
                    value={this.state.user.password}
                    type="password"
                    name="password"
                    id="create-password"
                    aria-describedby="create-password-error"
                    onChange={this.handleInputChange}
                    placeholder={t("forms.signin_overlay.password")}
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
                    {t("forms.signin_overlay.confirm_password")}
                  </label>
                  <input
                    value={this.state.user.passwordConfirmation}
                    type="password"
                    name="passwordConfirmation"
                    id="create-password-confirmation"
                    aria-describedby="create-password-confirmation-error"
                    onChange={this.handleInputChange}
                    placeholder={t("forms.signin_overlay.confirm_password")}
                  />
                </Form.Errorable>
              </div>
              <div className="row-1-p">
                <div className="form-input">
                  <input
                    className="button-secondary button-secondary--with-room"
                    type="submit"
                    value={t("forms.signin_overlay.create_account")}
                  />
                </div>
              </div>
            </form>
          )}
        </UIDConsumer>
        {this.OAuthProviderNames && (
          <>
            <p className="login-links">
              {t("forms.signin_overlay.oauth_instructions", {
                appName: installationName,
                providers: this.OAuthProviderNames
              })}
            </p>
            <LoginExternal
              settings={this.props.settings}
              dispatch={this.props.dispatch}
            />
          </>
        )}
        {this.renderTermsAndConditions(this.props)}
        <p className="login-links">
          <button
            onClick={event =>
              this.props.handleViewChange("account-login", event)
            }
            data-id="show-login"
          >
            {t("forms.signin_overlay.have_account")}
          </button>
        </p>
      </div>
    );
  }
}

export default withTranslation()(connectAndFetch(CreateContainer));

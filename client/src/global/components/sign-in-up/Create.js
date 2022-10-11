import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation, Trans } from "react-i18next";
import { usersAPI, requests } from "api";
import { entityStoreActions, currentUserActions } from "actions";
import { select } from "utils/entityUtils";
import Form, { Unwrapped } from "global/components/form";
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
    const fieldName = name.includes("firstName")
      ? "name"
      : name.replace("attributes[", "").replace("]", "");
    const adjustedValue = fieldName === "email" ? value.trim() : value;

    const user = {
      ...this.state.user,
      [fieldName]: adjustedValue
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
              <Form.Header
                id={id}
                label={t("forms.signin_overlay.create_account")}
                styleType="primary"
              />
              <Form.FieldGroup>
                <Unwrapped.Input
                  value={this.state.user.email}
                  type="text"
                  name="attributes[email]"
                  id="create-email"
                  aria-describedby="create-email-error"
                  onChange={this.handleInputChange}
                  placeholder={t("forms.signin_overlay.email")}
                  errors={errors}
                  idForError="create-email-error"
                  label={t("forms.signin_overlay.email")}
                />
                <Unwrapped.Input
                  value={this.state.user.name}
                  type="text"
                  id="create-name"
                  aria-describedby="create-name-error"
                  onChange={this.handleInputChange}
                  placeholder={t("forms.signin_overlay.name")}
                  idForError="create-name-error"
                  name={["attributes[firstName]", "attributes[lastName]"]}
                  errors={errors}
                  label={t("forms.signin_overlay.name")}
                />
                <Unwrapped.Input
                  value={this.state.user.password}
                  type="password"
                  id="create-password"
                  aria-describedby="create-password-error"
                  onChange={this.handleInputChange}
                  placeholder={t("forms.signin_overlay.password")}
                  idForError="create-password-error"
                  name="attributes[password]"
                  errors={errors}
                  label={t("forms.signin_overlay.password")}
                />
                <Unwrapped.Input
                  value={this.state.user.passwordConfirmation}
                  type="password"
                  id="create-password-confirmation"
                  aria-describedby="create-password-confirmation-error"
                  onChange={this.handleInputChange}
                  placeholder={t("forms.signin_overlay.confirm_password")}
                  idForError="create-password-confirmation-error"
                  name="attributes[passwordConfirmation]"
                  errors={errors}
                  label={t("forms.signin_overlay.confirm_password")}
                />
                <input
                  className="button-secondary button-secondary--with-room"
                  type="submit"
                  value={t("forms.signin_overlay.create_account")}
                />
              </Form.FieldGroup>
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

import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation, Trans } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { meAPI, requests } from "api";
import { entityStoreActions } from "actions";
import Form, { Unwrapped } from "global/components/form";
import get from "lodash/get";
import hasIn from "lodash/hasIn";
import Dropzone from "react-dropzone";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import { UIDConsumer } from "react-uid";
import * as Styled from "./styles";

const { request } = entityStoreActions;

export class UpdateFormContainer extends Component {
  static mapStateToProps = state => {
    return {
      response: state.entityStore.responses[requests.gAuthenticatedUserUpdate]
    };
  };

  static propTypes = {
    dispatch: PropTypes.func,
    response: PropTypes.object,
    authentication: PropTypes.object,
    hideSignInUpOverlay: PropTypes.func,
    history: PropTypes.object,
    mode: PropTypes.string,
    t: PropTypes.func
  };

  static defaultProps = {
    hideSignInUpOverlay: () => {}
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props);
    this.formRef = React.createRef();
  }

  componentDidMount() {
    if (this.formRef?.focus) this.formRef.focus();
  }

  componentDidUpdate(prevProps) {
    // If user is newly created, set state after authentication is complete in store
    if (
      !this.props.authentication.authenticating &&
      prevProps.authentication.authenticating
    ) {
      this.setState(this.initialState(this.props));
    }
  }

  setParams() {
    const params = {};
    Object.keys(this.state).forEach(key => {
      if (key === "removeAvatar" || key === "avatar") return null;
      if (key === "password" && this.state.password === "") return null;
      params[key] = this.state[key];
    });
    return params;
  }

  initialState(props) {
    return {
      nickname: this.currentUserAttribute(props, "nickname"),
      firstName: this.currentUserAttribute(props, "firstName"),
      lastName: this.currentUserAttribute(props, "lastName"),
      email: this.currentUserAttribute(props, "email"),
      password: "",
      passwordConfirmation: "",
      removeAvatar: false,
      avatar: null
    };
  }

  handleInputChange = event => {
    const name = event.target.name.replace("attributes[", "").replace("]", "");
    this.setState({ [name]: event.target.value });
  };

  doUpdateRequest = (avatarData = null) => {
    const params = this.setParams();
    params.removeAvatar = this.state.removeAvatar;
    if (avatarData) {
      params.avatar = {
        data: avatarData,
        content_type: this.state.avatar.type,
        filename: this.state.avatar.name
      };
    }
    const { promise } = this.props.dispatch(
      request(meAPI.update(params), requests.gAuthenticatedUserUpdate)
    );
    promise.then(() => {
      this.props.hideSignInUpOverlay();
    });
  };

  updateUser = event => {
    event.preventDefault();
    if (this.state.avatar) {
      const reader = new FileReader();
      reader.onload = eIgnored => {
        const data = reader.result;
        this.doUpdateRequest(data);
      };
      reader.readAsDataURL(this.state.avatar);
    } else {
      this.doUpdateRequest();
    }
  };

  hasAvatar = () => {
    return !!this.displayAvatar();
  };

  handleRemoveAvatar = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ avatar: null, removeAvatar: true });
  };

  handleFileDrop = file => {
    this.setState({ avatar: file[0], removeAvatar: false });
  };

  displayAvatar = () => {
    if (this.state.removeAvatar) return null;
    if (hasIn(this.state, "avatar.preview")) return this.state.avatar.preview;
    if (
      hasIn(
        this.props,
        "authentication.currentUser.attributes.avatarStyles.smallSquare"
      )
    ) {
      return this.props.authentication.currentUser.attributes.avatarStyles
        .smallSquare;
    }
    return null;
  };

  displayNickname = () => {
    if (this.state.nickname) return this.state.nickname;
    if (hasIn(this.props.authentication, "currentUser.attributes.nickname")) {
      return this.props.authentication.currentUser.attributes.nickname;
    }
    if (hasIn(this.props.authentication, "currentUser.attributes.firstName")) {
      return this.props.authentication.currentUser.attributes.firstName;
    }
  };

  currentUserAttribute = (props, attribute) => {
    if (!props.authentication.currentUser) return "";
    if (hasIn(props.authentication, `currentUser.attributes[${attribute}]`)) {
      return props.authentication.currentUser.attributes[attribute];
    }
    return "";
  };

  redirectToSubscriptions = event => {
    event.preventDefault();
    this.props.hideSignInUpOverlay();
    this.props.history.push(lh.link("subscriptions"));
  };

  renderProfileForm(errors) {
    const t = this.props.t;
    return (
      <>
        <div>
          {this.props.mode === "new" ? (
            <div>
              <p className="overlay-copy">
                {t("forms.signin_overlay.familiar_name")}
              </p>
            </div>
          ) : (
            <div>
              <p className="overlay-copy" id="update-nickname-label">
                {t("forms.signin_overlay.update_nickname")}
              </p>
            </div>
          )}
          <Unwrapped.Input
            value={this.state.nickname}
            type="text"
            id="update-nickname"
            aria-labelledby="update-nickname-label"
            aria-describedby="update-nickname-error"
            onChange={this.handleInputChange}
            placeholder={t("forms.signin_overlay.nickname")}
            name="attributes[nickname]"
            errors={errors}
            idForError="update-nickname-error"
          />
        </div>
        {__BROWSER__ ? (
          <div>
            {this.displayAvatar() ? null : (
              <p className="overlay-copy">
                {t("forms.signin_overlay.profile_img_instructions")}
              </p>
            )}
            <Form.Errorable
              idForError="avatar-update-error"
              name="attributes[avatar]"
              errors={errors}
            >
              <label htmlFor="avatar-update" className="screen-reader-text">
                {t("forms.signin_overlay.profile_img")}
              </label>
              <Dropzone onDrop={this.handleFileDrop}>
                {({ getRootProps, getInputProps }) => (
                  <Styled.Dropzone
                    {...getRootProps({
                      tabIndex: null
                    })}
                  >
                    <Styled.DropzoneInput
                      {...getInputProps({
                        accept: "image/*",
                        multiple: false,
                        id: "avatar-update",
                        "aria-describedby": "avatar-update-error",
                        tabIndex: 0
                      })}
                    />
                    <Styled.DropzoneOutline>
                      <Styled.RemoveWrapper>
                        {this.hasAvatar() && (
                          <Styled.RemoveButton
                            onClick={this.handleRemoveAvatar}
                            tabIndex="0"
                          >
                            <IconComposer icon="close16" size="default" />
                            <span className="screen-reader-text">
                              {t("forms.signin_overlay.remove_avatar")}
                            </span>
                          </Styled.RemoveButton>
                        )}
                        <Styled.Avatar url={this.displayAvatar()} />
                      </Styled.RemoveWrapper>
                      <Styled.DropzonePrompt>
                        <Trans
                          i18nKey="forms.signin_overlay.upload_avatar_instructions"
                          components={[<span />]}
                        />
                      </Styled.DropzonePrompt>
                    </Styled.DropzoneOutline>
                  </Styled.Dropzone>
                )}
              </Dropzone>
            </Form.Errorable>
          </div>
        ) : null}
        <div>
          <p className="overlay-copy">
            {t("forms.signin_overlay.edit_account")}
          </p>
          <Unwrapped.Input
            value={this.state.firstName}
            type="text"
            id="update-firstName"
            aria-describedby="update-firstName-error"
            onChange={this.handleInputChange}
            placeholder={t("forms.signin_overlay.first_name")}
            name="attributes[firstName]"
            errors={errors}
            idForError="update-firstName-error"
            label={t("forms.signin_overlay.first_name")}
          />
        </div>
        <Unwrapped.Input
          value={this.state.lastName}
          type="text"
          id="update-lastName"
          aria-describedby="update-lastName-error"
          onChange={this.handleInputChange}
          placeholder={t("forms.signin_overlay.last_name")}
          name="attributes[lastName]"
          errors={errors}
          idForError="update-lastName-error"
          label={t("forms.signin_overlay.last_name")}
        />
        <Unwrapped.Input
          value={this.state.email}
          type="text"
          id="update-email"
          aria-describedby="update-email-error"
          onChange={this.handleInputChange}
          placeholder={t("forms.signin_overlay.email")}
          name="attributes[email]"
          errors={errors}
          idForError="update-email-error"
          label={t("forms.signin_overlay.email")}
        />
        <Unwrapped.Input
          value={this.state.password}
          type="password"
          id="update-password"
          aria-describedby="update-password-error"
          onChange={this.handleInputChange}
          placeholder={t("forms.signin_overlay.new_password")}
          name="attributes[password]"
          errors={errors}
          idForError="update-password-error"
          label={t("forms.signin_overlay.password")}
        />
        <Unwrapped.Input
          value={this.state.passwordConfirmation}
          type="password"
          id="update-passwordConfirmation"
          aria-describedby="update-passwordConfirmation-error"
          onChange={this.handleInputChange}
          placeholder={t("forms.signin_overlay.confirm_new_password")}
          name="attributes[passwordConfirmation]"
          errors={errors}
          idForError="update-passwordConfirmation-error"
          label={t("forms.signin_overlay.confirm_password")}
        />
      </>
    );
  }

  render() {
    const errors = get(this.props.response, "errors") || [];
    const currentUser = this.props.authentication.currentUser;
    if (!currentUser) return null;
    const t = this.props.t;
    return (
      <section className="sign-in-up-update">
        <UIDConsumer>
          {id => (
            <form
              autoComplete="off"
              method="post"
              onSubmit={this.updateUser}
              tabIndex={-1}
              ref={el => (this.formRef = el)}
              aria-labelledby={id}
            >
              <h2 id={id} className="screen-reader-text">
                {t("forms.signin_overlay.update_sr_title")}
              </h2>
              {this.props.mode === "new" ? (
                <div>
                  <Trans
                    i18nKey="forms.signin_overlay.create_success_message"
                    components={[
                      <Form.Header styleType="primary" />,
                      <p className="overlay-copy" />,
                      <h4 className="nickname" />
                    ]}
                    values={{ name: this.displayNickname() }}
                  />
                </div>
              ) : (
                <div>
                  <Form.Header
                    styleType="primary"
                    label={
                      <Trans
                        i18nKey="forms.signin_overlay.greeting"
                        components={[<span className="nickname" />]}
                        values={{ name: this.displayNickname() }}
                      />
                    }
                  />
                </div>
              )}
              <Form.FieldGroup>
                {this.renderProfileForm(errors)}
              </Form.FieldGroup>
              <input
                className="button-secondary button-secondary--with-room"
                type="submit"
                value={t("forms.signin_overlay.submit_update_label")}
              />
            </form>
          )}
        </UIDConsumer>

        <Styled.Subscriptions>
          <Styled.SubscriptionsLabel>
            {t("forms.signin_overlay.subscriptions__label")}
          </Styled.SubscriptionsLabel>
          <button
            className="button-secondary button-secondary--outlined button-secondary--color-white"
            onClick={this.redirectToSubscriptions}
          >
            <span className="button-secondary__text">
              {t("forms.signin_overlay.notification_settings")}
            </span>
            <IconComposer
              icon="arrowLongRight16"
              size="default"
              className="button-secondary__icon"
            />
          </button>
        </Styled.Subscriptions>
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(UpdateFormContainer));

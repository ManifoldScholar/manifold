import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Dialog from "global/components/dialog";
import withConfirmation from "hoc/withConfirmation";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { usersAPI, requests } from "api";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import * as Styled from "./styles";

const { request, flush } = entityStoreActions;

export class UsersEditContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      user: select(requests.beUser, state.entityStore),
      createMakerResponse: get(
        state.entityStore.responses,
        requests.beMakerCreate
      )
    };
  };

  static displayName = "Users.Edit";

  static propTypes = {
    match: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    dispatch: PropTypes.func,
    user: PropTypes.object,
    history: PropTypes.object,
    t: PropTypes.func,
    refetch: PropTypes.func.isRequired
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  constructor(props) {
    super(props);
    this.state = {
      resetPassword: null
    };
  }

  componentDidMount() {
    this.fetchUser(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchUser(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.beUserUpdate, requests.beMakerCreate]));
  }

  get user() {
    return this.props.user;
  }

  fetchUser(id) {
    const call = usersAPI.show(id);
    const userRequest = request(call, requests.beUser);
    this.props.dispatch(userRequest);
  }

  handleUserDestroy = () => {
    const t = this.props.t;
    const heading = t("modals.delete_user");
    const message = t("modals.confirm_body");
    this.props.confirm(heading, message, this.destroyUser);
  };

  destroyUser = () => {
    const user = this.user;
    const call = usersAPI.destroy(user.id);
    const userRequest = request(call, requests.beUserDestroy);
    this.props.dispatch(userRequest).promise.then(() => {
      this.props.refetch();
      this.props.history.push(lh.link("backendRecordsUsers"));
    });
  };

  unsubscribeUser = () => {
    const t = this.props.t;
    const heading = t("modals.unsubscribe");
    const message = t("modals.unsubscribe_body");
    this.props.confirm(heading, message, () => {
      const adjustedUser = { ...this.user };
      adjustedUser.attributes.unsubscribe = true;

      const call = usersAPI.update(this.user.id, adjustedUser);
      const options = { notificationScope: "drawer" };
      const userRequest = request(call, requests.beUserUpdate, options);
      return this.props.dispatch(userRequest);
    });
  };

  verifyUser = () => {
    const t = this.props.t;
    const verified = this.user.attributes.adminVerified;
    const heading = verified ? t("modals.unverify") : t("modals.verify");
    const message = verified
      ? t("modals.unverify_body")
      : t("modals.verify_body");
    this.props.confirm(heading, message, () => {
      const adjustedUser = { ...this.user };
      adjustedUser.attributes.adminVerified = !verified;

      const call = usersAPI.update(this.user.id, adjustedUser);
      const options = { notificationScope: "drawer" };
      const userRequest = request(call, requests.beUserUpdate, options);
      return this.props.dispatch(userRequest);
    });
  };

  closeResetDialog() {
    this.setState({ resetPassword: null });
  }

  handleResetPasswordClick = () => {
    const t = this.props.t;
    const heading = t("modals.password_reset");
    const message = t("modals.password_reset_body");
    new Promise((resolve, reject) => {
      this.setState({
        resetPassword: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.closeResetDialog();
      },
      () => {
        this.closeResetDialog();
      }
    );
  };

  humanReadableDate = date => {
    return this.props.t("dates.date", {
      val: new Date(date),
      formatParams: {
        val: { year: "numeric", month: "long", day: "numeric" }
      }
    });
  };

  get noPublicEngagement() {
    const attr = this.user.attributes;
    return !(attr.trusted || attr.established);
  }

  get userVerificationList() {
    const t = this.props.t;
    const attr = this.user.attributes;

    const emailMessage = attr.emailConfirmed
      ? t("records.users.email_verified_at", {
          date: this.humanReadableDate(attr.emailConfirmedAt)
        })
      : t("records.users.email_not_verified");

    return (
      <>
        {/* eslint-disable no-nested-ternary */}
        {attr.trusted ? (
          <li>
            <span>{t("records.users.trusted")}</span>
          </li>
        ) : attr.adminVerified ? (
          <li>
            <span>{t("records.users.admin_verified")}</span>
          </li>
        ) : null}
        <li>
          <span>{emailMessage}</span>
        </li>
        {this.noPublicEngagement && (
          <li>
            <span>{t("records.users.no_public_engagement")}</span>
          </li>
        )}
      </>
    );
  }

  render() {
    if (!this.user) return null;
    const attr = this.user.attributes;
    const user = this.user;
    const t = this.props.t;

    return (
      <div>
        {this.state.resetPassword ? (
          <Dialog.ResetPassword
            uiProps={this.state.resetPassword}
            {...this.props}
          />
        ) : null}

        <Layout.DrawerHeader
          title={`${attr.firstName} ${attr.lastName}`}
          buttons={[
            {
              onClick: this.verifyUser,
              icon: "privacy24",
              label: user.attributes.adminVerified
                ? t("records.users.block")
                : t("records.users.verify")
            },
            {
              onClick: this.unsubscribeUser,
              icon: "mail32",
              label: t("records.users.unsubscribe")
            },
            {
              onClick: this.handleResetPasswordClick,
              icon: "key32",
              label: t("records.users.reset_password")
            },
            {
              onClick: this.handleUserDestroy,
              icon: "delete32",
              label: t("actions.delete"),
              className: "utility-button__icon--notice"
            }
          ]}
          buttonLayout="grid"
        />
        <Styled.UserVerification $warn={this.noPublicEngagement}>
          {this.userVerificationList}
        </Styled.UserVerification>
        <section>
          <FormContainer.Form
            model={this.user}
            name={requests.beUserUpdate}
            update={usersAPI.update}
            create={usersAPI.create}
            className="form-secondary"
            notificationScope="drawer"
          >
            <Form.TextInput
              focusOnMount
              label={t("records.users.email")}
              name="attributes[email]"
              placeholder={t("records.users.email")}
            />
            <Form.TextInput
              label={t("records.users.first_name")}
              name="attributes[firstName]"
              placeholder={t("records.users.first_name")}
            />
            <Form.TextInput
              label={t("records.users.last_name")}
              name="attributes[lastName]"
              placeholder={t("records.users.last_name")}
            />
            <Form.Select
              label={t("records.users.role_label")}
              name="attributes[role]"
              selected={user.attributes.role}
              options={[
                {
                  label: t("records.users.role_options.admin"),
                  value: "admin"
                },
                {
                  label: t("records.users.role_options.editor"),
                  value: "editor"
                },
                {
                  label: t("records.users.role_options.creator"),
                  value: "project_creator"
                },
                {
                  label: t("records.users.role_options.marketeer"),
                  value: "marketeer"
                },
                {
                  label: t("records.users.role_options.reader"),
                  value: "reader"
                }
              ]}
            />
            <Form.Save text="Save User" />
          </FormContainer.Form>
        </section>
      </div>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(UsersEditContainer))
);

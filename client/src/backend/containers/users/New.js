import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { usersAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";

export class UsersNewContainer extends PureComponent {
  static displayName = "Users.New";

  static propTypes = {
    history: PropTypes.object,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.defaultUser = { attributes: { role: "reader" } };
  }

  redirectToUser(user) {
    const path = lh.link("backendRecordsUser", user.id);
    this.props.history.push(path, { keepNotifications: true });
  }

  createUser(user) {
    const meta = { createdByAdmin: true };
    return usersAPI.create({ ...user, meta });
  }

  handleSuccess = user => {
    this.redirectToUser(user);
  };

  render() {
    const t = this.props.t;
    return (
      <section>
        <Layout.DrawerHeader title={t("records.users.new_header")} />
        <FormContainer.Form
          model={this.defaultUser}
          name={requests.beUserCreate}
          update={usersAPI.update}
          create={this.createUser}
          onSuccess={this.handleSuccess}
          options={{ adds: requests.beUsers }}
          className="form-secondary"
          notificationScope="drawer"
        >
          <Form.TextInput
            focusOnMount
            label={t("records.users.email")}
            name="attributes[email]"
            placeholder={t("records.users.email")}
          />
          <Form.Select
            label={t("records.users.role_label")}
            name="attributes[role]"
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
          <Form.GeneratedPasswordInput name="attributes[password]" />
          <Form.Save text={t("records.users.submit_label")} />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(UsersNewContainer));

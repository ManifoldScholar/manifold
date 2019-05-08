import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Form from "backend/components/form";
import FormContainer from "backend/containers/form";
import { usersAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";

export class UsersNewContainer extends PureComponent {
  static displayName = "Users.New";

  static propTypes = {
    history: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.defaultUser = { attributes: { role: "reader" } };
  }

  createUser(user) {
    const meta = { createdByAdmin: true };
    return usersAPI.create(Object.assign({}, user, { meta }));
  }

  handleSuccess = user => {
    this.redirectToUser(user);
  };

  redirectToUser(user) {
    const path = lh.link("backendRecordsUser", user.id);
    this.props.history.push(path, { keepNotifications: true });
  }

  render() {
    return (
      <section>
        <Navigation.DrawerHeader title="New User" />
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
            label="Email"
            name="attributes[email]"
            placeholder="Email"
          />
          <Form.Select
            label="Role"
            name="attributes[role]"
            options={[
              { label: "Admin", value: "admin" },
              { label: "Editor", value: "editor" },
              { label: "Project Creator", value: "project_creator" },
              { label: "Marketeer", value: "marketeer" },
              { label: "Reader", value: "reader" }
            ]}
          />
          <Form.TextInput
            label="First Name"
            name="attributes[firstName]"
            placeholder="First Name"
          />
          <Form.TextInput
            label="Last Name"
            name="attributes[lastName]"
            placeholder="Last Name"
          />
          <Form.GeneratedPasswordInput name="attributes[password]" />
          <Form.Save text="Save User" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connectAndFetch(UsersNewContainer);

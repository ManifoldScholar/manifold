import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { usersAPI, permissionsAPI, requests } from "api";
import connectAndFetch from "utils/connectAndFetch";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import * as Styled from "./styles";

export class PermissionForm extends PureComponent {
  static displayName = "Permission.Form";

  static propTypes = {
    history: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    permission: PropTypes.object,
    showUserInput: PropTypes.bool,
    dispatch: PropTypes.func,
    t: PropTypes.func
  };

  handleSuccess = newPermission => {
    if (this.props.permission) return null; // Skip if this permission already existed
    const base = lh.nameFromType("backend", "Permission", this.props.entity);
    const url = lh.link(base, this.props.entity.id, newPermission.id);
    return this.props.history.push(url, { keepNotifications: true });
  };

  composeCreateCall = permission => {
    const entity = this.props.entity;
    if (!permission || !entity) return null;
    return permissionsAPI.create(entity, permission);
  };

  composeUpdateCall = (id, permission) => {
    const entity = this.props.entity;
    if (!permission || !entity) return null;
    return permissionsAPI.update(entity, id, permission);
  };

  labelUser = user => user.attributes.fullName;

  renderSelectedUser(user) {
    if (!user) return null;
    const attr = user.attributes;
    return (
      <Styled.User>
        <Styled.Avatar>
          <EntityThumbnail.User entity={user} />
        </Styled.Avatar>
        <Styled.Name>{attr.fullName}</Styled.Name>
      </Styled.User>
    );
  }

  fetchUsers = () => {
    return usersAPI.index({ order: "first_name, last_name" });
  };

  renderUser(props) {
    if (props.permission) {
      return this.renderSelectedUser(props.permission.relationships.user);
    }

    const t = this.props.t;

    return (
      <Form.Picker
        label={t("projects.permissions.user_label")}
        listStyle={"well"}
        name="relationships[user]"
        options={this.fetchUsers}
        optionToLabel={u => u.attributes.fullName}
        placeholder={t("projects.permissions.user_placeholder")}
        predictive
        listRowComponent="UserRow"
        wide
      />
    );
  }

  render() {
    const { permission, t } = this.props;
    const name = permission
      ? requests.bePermissionUpdate
      : requests.bePermissionCreate;

    return (
      <section>
        <FormContainer.Form
          model={permission}
          doNotWarn
          name={name}
          update={this.composeUpdateCall}
          create={this.composeCreateCall}
          options={{ adds: requests.bePermissions }}
          onSuccess={this.handleSuccess}
          className="form-secondary"
          notificationScope="drawer"
        >
          {this.renderUser(this.props)}
          <Form.SwitchArray
            name="attributes[roleNames]"
            options={[
              {
                label: t("projects.permissions.modify_project"),
                value: "project_editor"
              },
              {
                label: t("projects.permissions.modify_resource"),
                value: "project_resource_editor"
              },
              {
                label: t("projects.permissions.author"),
                value: "project_author"
              }
            ]}
            focusOnMount={this.props.showUserInput}
          />
          <Form.Save text={t("projects.permissions.submit_label")} />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(PermissionForm));

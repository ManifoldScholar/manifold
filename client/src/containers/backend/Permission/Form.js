import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { usersAPI, permissionsAPI, requests } from "api";
import connectAndFetch from "utils/connectAndFetch";
import lh from "helpers/linkHandler";
import pick from "lodash/pick";

export class PermissionForm extends PureComponent {
  static displayName = "Permission.Form";

  static propTypes = {
    history: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    permission: PropTypes.object,
    showUserInput: PropTypes.bool,
    dispatch: PropTypes.func
  };

  handleSuccess = newPermission => {
    if (this.props.permission) return null; // Skip if this permission already existed
    const base = lh.nameFromType("backendProject", "Permission", this.props.entity);
    const url = lh.link(base, this.props.entity.id, newPermission.id);
    return this.props.history.push(url, { keepNotifications: true });
  };

  composeCreateCall = permission => {
    const entity = this.props.entity;
    if (!permission || !entity) return null;
    return permissionsAPI.create(entity, this.adjustPermission(permission));
  };

  composeUpdateCall = (id, permission) => {
    const entity = this.props.entity;
    if (!permission || !entity) return null;
    return permissionsAPI.update(entity, id, permission);
  };

  adjustPermission(permission) {
    const attributes = permission.attributes;
    const relationships = {};
    Object.keys(permission.relationships).forEach(
      r =>
        (relationships[r] = {
          data: pick(permission.relationships[r], ["id", "type"])
        })
    );
    return Object.assign({}, { attributes }, { relationships });
  }

  labelUser = user => user.attributes.fullName;

  renderSelectedUser(user) {
    if (!user) return null;
    const attr = user.attributes;
    return (
      <div className="user">
        <figure className="avatar">
          {attr.avatarStyles.smallSquare ? (
            <div
              className="image"
              style={{
                backgroundImage: `url(${attr.avatarStyles.smallSquare})`
              }}
            />
          ) : (
            <div className="no-image">
              <i className="manicon manicon-person" aria-hidden="true" />
            </div>
          )}
        </figure>
        <div className="meta">
          <h3 className="name large">{attr.fullName}</h3>
        </div>
      </div>
    );
  }

  render() {
    const { permission } = this.props;
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
          className="form-secondary permissions-form"
          notificationScope="drawer"
        >
          <Form.PredictiveBelongsTo
            readOnly={this.props.showUserInput}
            renderSelected={this.renderSelectedUser}
            fetch={usersAPI.index}
            placeholder="Select User"
            label={this.labelUser}
            relationName="user"
            focusOnMount={!this.props.showUserInput}
          />
          <Form.SwitchArray
            name="attributes[roleNames]"
            label="Permissions"
            options={[
              { label: "Can modify project?", value: "project_editor" },
              {
                label: "Can modify resource metadata?",
                value: "project_resource_editor"
              },
              { label: "Is a project author?", value: "project_author" }
            ]}
            focusOnMount={this.props.showUserInput}
          />
          <Form.Save text="Save Permissions" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connectAndFetch(PermissionForm);

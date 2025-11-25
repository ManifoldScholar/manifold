import { useTranslation } from "react-i18next";
import { useOutletContext, useNavigate } from "react-router-dom";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { usersAPI, permissionsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import * as Styled from "./styles";

const fetchUsers = () => usersAPI.index({ order: "first_name, last_name" });

export default function PermissionForm({ permission, showUserInput }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { entity } = useOutletContext() || {};

  if (!entity) return null;

  const handleSuccess = newPermission => {
    if (permission) return null;
    const base = lh.nameFromType("backend", "Permission", entity);
    const url = lh.link(base, entity.id, newPermission.id);
    navigate(url, { state: { keepNotifications: true } });
  };

  const composeCreateCall = permissionData => {
    if (!permissionData) return null;
    return permissionsAPI.create(entity, permissionData);
  };

  const composeUpdateCall = (permissionId, permissionData) => {
    if (!permissionData) return null;
    return permissionsAPI.update(entity, permissionId, permissionData);
  };

  const renderSelectedUser = user => {
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
  };

  const renderUserInput = () => {
    if (permission) {
      return renderSelectedUser(permission.relationships.user);
    }

    return (
      <Form.Picker
        label={t("projects.permissions.user_label")}
        listStyle={"well"}
        name="relationships[user]"
        options={fetchUsers}
        optionToLabel={u => u.attributes.fullName}
        placeholder={t("projects.permissions.user_placeholder")}
        predictive
        listRowComponent="UserRow"
        wide
      />
    );
  };

  const name = permission
    ? requests.bePermissionUpdate
    : requests.bePermissionCreate;

  return (
    <section>
      <FormContainer.Form
        model={permission}
        doNotWarn
        name={name}
        update={composeUpdateCall}
        create={composeCreateCall}
        options={{ adds: requests.bePermissions }}
        onSuccess={handleSuccess}
        className="form-secondary"
        notificationScope="drawer"
      >
        {renderUserInput()}
        <Form.SwitchArray
          name="attributes[roleNames]"
          options={[
            {
              label: t("projects.permissions.modify_project"),
              value: "project_editor"
            },
            {
              label: t("projects.permissions.modify_project_properties"),
              value: "project_property_manager"
            },
            {
              label: t("projects.permissions.author"),
              value: "project_author"
            }
          ]}
          focusOnMount={showUserInput}
        />
        <Form.Save text={t("projects.permissions.submit_label")} />
      </FormContainer.Form>
    </section>
  );
}

PermissionForm.displayName = "Permission.Form";

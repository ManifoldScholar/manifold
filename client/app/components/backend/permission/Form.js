import { useTranslation } from "react-i18next";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";
import { usersAPI } from "api";
import EntityThumbnail from "components/global/entity-thumbnail";
import * as Styled from "./styles";

const fetchUsers = () => usersAPI.index({ order: "first_name, last_name" });

export default function PermissionForm({ fetcher, permission, showUserInput }) {
  const { t } = useTranslation();

  const renderSelectedUser = user => {
    if (!user) return null;
    return (
      <Styled.User>
        <Styled.Avatar>
          <EntityThumbnail.User entity={user} />
        </Styled.Avatar>
        <Styled.Name>{user?.attributes?.fullName}</Styled.Name>
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

  return (
    <section>
      <FormContainer.Form
        fetcher={fetcher}
        model={permission}
        doNotWarn
        className="form-secondary"
        notifyOnSuccess
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

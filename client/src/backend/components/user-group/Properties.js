import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom-v5-compat";
import lh from "helpers/linkHandler";
import { userGroupsAPI } from "api";
import Form from "global/components/form";
import FormContainer from "global/containers/form";

export default function UserGroupProperties({ userGroup, refresh }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const redirectToUserGroup = newGroup => {
    if (refresh) refresh();
    const path = lh.link("backendRecordsUserGroup", newGroup.id);
    navigate(path, { keepNotifications: true });
  };

  return (
    <FormContainer.Form
      model={userGroup ?? { attributes: {} }}
      update={userGroupsAPI.update}
      create={userGroupsAPI.create}
      onSuccess={!userGroup ? redirectToUserGroup : undefined}
      className="form-secondary"
      name="be-user-group"
    >
      <Form.TextInput
        focusOnMount
        label={t("records.user_groups.properties.name_label")}
        name="attributes[name]"
        placeholder={t("records.user_groups.properties.name_placeholder")}
        instructions={t("records.user_groups.properties.name_instructions")}
      />
      <Form.TextInput
        label={t("records.user_groups.properties.external_id_label")}
        name="attributes[externalId]"
        placeholder={t(
          "records.user_groups.properties.external_id_placeholder"
        )}
        instructions={t(
          "records.user_groups.properties.external_id_instructions"
        )}
      />
      <Form.Save text={t("records.user_groups.properties.submit_label")} />
    </FormContainer.Form>
  );
}

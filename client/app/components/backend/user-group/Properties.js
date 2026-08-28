import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";

const DEFAULT_USER_GROUP = { attributes: {} };

export default function UserGroupProperties({ userGroup, fetcher }) {
  const { t } = useTranslation();

  return (
    <FormContainer.Form
      fetcher={fetcher}
      model={userGroup ?? DEFAULT_USER_GROUP}
      className="form-secondary"
      notifyOnSuccess
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
        name="attributes[externalIdentifier]"
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

UserGroupProperties.displayName = "UserGroup.Properties";

UserGroupProperties.propTypes = {
  userGroup: PropTypes.object,
  fetcher: PropTypes.object.isRequired
};

import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Properties from "backend/components/user-group/Properties";
import Form from "global/components/form";

export default function UserGroupProperties() {
  const { t } = useTranslation();
  const { userGroup } = useOutletContext();

  return (
    <section>
      <Form.FieldGroup label={t("records.features.properties_label")}>
        <Properties userGroup={userGroup} />
      </Form.FieldGroup>
    </section>
  );
}

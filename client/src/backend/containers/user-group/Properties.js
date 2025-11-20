import { useTranslation } from "react-i18next";
import Properties from "backend/components/user-group/Properties";
import Form from "global/components/form";

export default function UserGroupProperties({ userGroup }) {
  const { t } = useTranslation();

  return (
    <section>
      <Form.FieldGroup label={t("records.features.properties_label")}>
        <Properties userGroup={userGroup} />
      </Form.FieldGroup>
    </section>
  );
}

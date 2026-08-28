import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import { userGroupsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import Form from "components/global/form";
import Properties from "components/backend/user-group/Properties";

export const action = formAction({
  mutation: ({ data, params }) => userGroupsAPI.update(params.id, data)
});

export default function UserGroupPropertiesRoute() {
  const { t } = useTranslation();
  const { userGroup } = useOutletContext();
  const fetcher = useFetcher();

  return (
    <section>
      <Form.FieldGroup label={t("records.user_groups.properties.header")}>
        <Properties userGroup={userGroup} fetcher={fetcher} />
      </Form.FieldGroup>
    </section>
  );
}

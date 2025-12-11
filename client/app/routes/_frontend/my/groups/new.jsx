import { useSubmit } from "react-router";
import { readingGroupsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import Layout from "components/backend/layout";
import { useTranslation } from "react-i18next";
import { GroupSettingsForm } from "components/frontend/reading-group/forms";

export const handle = {
  drawer: true
};

export const action = formAction({
  mutation: ({ data }) => readingGroupsAPI.create(data),
  redirectTo: () => "/my/groups",
  errorMessage: "Failed to create reading group"
});

export default function ReadingGroupsNewRoute({ actionData }) {
  const submit = useSubmit();
  const { t } = useTranslation();

  return (
    <section>
      <Layout.DrawerHeader title={t("forms.reading_group.drawer_title")} />
      <GroupSettingsForm submit={submit} errors={actionData?.errors || []} />
    </section>
  );
}

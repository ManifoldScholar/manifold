import { useSubmit, redirect } from "react-router";
import { readingGroupsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Layout from "backend/components/layout";
import { useTranslation } from "react-i18next";
import { GroupSettingsForm } from "frontend/components/reading-group/forms";

export const handle = {
  drawer: true
};

export async function action({ request, context }) {
  const data = await request.json();

  try {
    const result = await queryApi(readingGroupsAPI.create(data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    return redirect("/my/groups");
  } catch (error) {
    return handleActionError(error, "Failed to create reading group");
  }
}

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

import { useSubmit, redirect } from "react-router";
import { readingGroupsAPI } from "api";
import { getApiClient } from "app/routes/utility/helpers/getApiClient";
import Layout from "backend/components/layout";
import { useTranslation } from "react-i18next";
import { GroupSettingsForm } from "frontend/components/reading-group/forms";

export const handle = {
  drawer: true
};

export async function action({ request, context }) {
  const data = await request.json();

  const client = getApiClient(context);

  try {
    const result = await client.call(readingGroupsAPI.create(data));

    if (result?.errors) {
      return { errors: result.errors };
    }

    return redirect("/my/groups");
  } catch (error) {
    return {
      errors: [
        {
          detail: error.message || "Failed to create reading group",
          source: { pointer: "/data" }
        }
      ]
    };
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

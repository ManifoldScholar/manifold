import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import { subjectsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Layout from "backend/components/layout";

export const handle = { drawer: true };

export async function action({ request, context }) {
  const data = await request.json();

  try {
    const result = await queryApi(subjectsAPI.create(data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect("/backend/settings/subjects");
  } catch (error) {
    return handleActionError(error);
  }
}

export default function SettingsSubjectsNew() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("settings.subjects.new_header")} />
      <FormContainer.Form className="form-secondary" fetcher={fetcher}>
        <Form.TextInput
          validation={["required"]}
          focusOnMount
          label={t("settings.subjects.name_label")}
          name="attributes[name]"
          placeholder={t("settings.subjects.name_placeholder")}
        />
        <Form.Save
          text={t("settings.subjects.new_save")}
          cancelRoute="/backend/settings/subjects"
        />
      </FormContainer.Form>
    </section>
  );
}

import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { subjectsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";
import Layout from "components/backend/layout";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data }) => subjectsAPI.create(data),
  redirectTo: () => "/backend/settings/subjects"
});

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

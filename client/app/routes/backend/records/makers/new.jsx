import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { makersAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import authorize from "app/routes/utility/loaders/authorize";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";
import Layout from "components/backend/layout";

export const handle = { drawer: true };

export const loader = async ({ request, context }) => {
  await authorize({ request, context, ability: "create", entity: "maker" });
  return null;
};

export const action = formAction({
  mutation: ({ data }) => makersAPI.create(data),
  redirectTo: ({ result }) => `/backend/records/makers/${result.data.id}`
});

export default function MakersNew() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("records.makers.new_header")} />
      <FormContainer.Form
        fetcher={fetcher}
        className="form-secondary"
        notifyOnSuccess
      >
        <Form.TextInput
          label={t("records.makers.title")}
          name="attributes[prefix]"
          placeholder={t("records.makers.title")}
          focusOnMount
          wide
        />
        <Form.TextInput
          label={t("records.makers.first_name")}
          name="attributes[firstName]"
          placeholder={t("records.makers.first_name")}
          wide
        />
        <Form.TextInput
          label={t("records.makers.middle_name")}
          name="attributes[middleName]"
          placeholder={t("records.makers.middle_name")}
          wide
        />
        <Form.TextInput
          label={t("records.makers.last_name")}
          name="attributes[lastName]"
          placeholder={t("records.makers.last_name")}
          wide
        />
        <Form.TextInput
          label={t("records.makers.suffix")}
          name="attributes[suffix]"
          placeholder={t("records.makers.suffix")}
          wide
        />
        <Form.Upload
          layout="square"
          accepts="images"
          label={t("records.makers.avatar")}
          readFrom="attributes[avatarStyles][small]"
          name="attributes[avatar]"
          remove="attributes[removeAvatar]"
          wide
        />
        <Form.Save text={t("records.makers.submit_label")} />
      </FormContainer.Form>
    </section>
  );
}

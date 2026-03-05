import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import { makersAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import authorize from "app/routes/utility/loaders/authorize";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Layout from "backend/components/layout";

export const handle = { drawer: true };

export const loader = async ({ request, context }) => {
  await authorize({ request, context, ability: "create", entity: "maker" });
  return null;
};

export async function action({ request, context }) {
  const data = await request.json();

  try {
    const result = await queryApi(makersAPI.create(data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(`/backend/records/makers/${result.data.id}`);
  } catch (error) {
    return handleActionError(error);
  }
}

export default function MakersNew() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("records.makers.new_header")} />
      <FormContainer.Form
        fetcher={fetcher}

        className="form-secondary"
        notificationScope="drawer"
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

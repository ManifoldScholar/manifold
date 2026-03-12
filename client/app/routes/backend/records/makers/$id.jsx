import { useTranslation } from "react-i18next";
import { useFetcher, useNavigate } from "react-router";
import { makersAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import { useApiCallback, useConfirmation } from "hooks";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Layout from "backend/components/layout";
import Dialog from "global/components/dialog";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => makersAPI.show(params.id),
    request
  });
};

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(makersAPI.update(params.id, data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export default function MakersEdit({ loaderData: maker }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { confirm, confirmation } = useConfirmation();

  const deleteMaker = useApiCallback(makersAPI.destroy);

  const handleDestroy = () => {
    confirm({
      heading: t("modals.delete_maker"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await deleteMaker(maker.id);
          navigate("/backend/records/makers");
        } catch {
          closeDialog();
        }
      }
    });
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <section>
        <Layout.DrawerHeader
          title={maker.attributes.fullName}
          buttons={[
            {
              onClick: handleDestroy,
              icon: "delete32",
              label: t("actions.delete"),
              entity: maker,
              ability: "delete",
              className: "utility-button__icon--notice"
            }
          ]}
        />
        <FormContainer.Form
          fetcher={fetcher}
          model={maker}
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
    </>
  );
}

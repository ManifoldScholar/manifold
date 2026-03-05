import { useTranslation } from "react-i18next";
import { useFetcher, useNavigate, useRevalidator } from "react-router";
import { subjectsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Layout from "backend/components/layout";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Dialog from "global/components/dialog";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => subjectsAPI.show(params.id),
    request
  });
};

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(subjectsAPI.update(params.id, data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export default function SettingsSubjectsEdit({ loaderData: subject }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();

  const destroySubject = useApiCallback(subjectsAPI.destroy);

  const handleSubjectDestroy = () => {
    confirm({
      heading: t("modals.delete_subject"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        await destroySubject(subject?.id);
        closeDialog();
        revalidate();
        navigate("/backend/settings/subjects");
      }
    });
  };

  return (
    <div>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <Layout.DrawerHeader
        title={subject.attributes.name}
        buttons={[
          {
            onClick: handleSubjectDestroy,
            icon: "delete32",
            label: t("actions.delete"),
            className: "utility-button__icon--notice"
          }
        ]}
      />
      <section>
        <FormContainer.Form
          model={subject}
          className="form-secondary"
          fetcher={fetcher}
        >
          <Form.TextInput
            label={t("settings.subjects.name_label")}
            name="attributes[name]"
            placeholder={t("settings.subjects.name_label")}
          />
          <Form.Save text={t("settings.subjects.save")} />
        </FormContainer.Form>
      </section>
    </div>
  );
}

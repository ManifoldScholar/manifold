import { useTranslation } from "react-i18next";
import { useFetcher, useNavigate } from "react-router";
import { subjectsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import loadEntity from "lib/react-router/loaders/loadEntity";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";
import Layout from "components/backend/layout";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Dialog from "components/global/dialog";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => subjectsAPI.show(params.id),
    request
  });
};

export const action = formAction({
  mutation: ({ data, params }) => subjectsAPI.update(params.id, data)
});

export default function SettingsSubjectsEdit({ loaderData: subject }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { confirm, confirmation } = useConfirmation();

  const destroySubject = useApiCallback(subjectsAPI.destroy);

  const handleSubjectDestroy = () => {
    confirm({
      heading: t("modals.delete_subject"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await destroySubject(subject?.id);
          navigate("/backend/settings/subjects");
        } catch {
          closeDialog();
        }
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
          notifyOnSuccess
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

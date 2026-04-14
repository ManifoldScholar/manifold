import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext, useNavigate } from "react-router";
import ProjectCollection from "components/backend/project-collection";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";
import { projectCollectionsAPI } from "api";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Dialog from "components/global/dialog";
import formAction from "app/routes/utility/helpers/formAction";
import mergeImageAltText from "app/routes/utility/helpers/mergeImageAltText";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) => {
    const relationships = data.relationships?.subjects
      ? { subjects: data.relationships.subjects }
      : {};
    const formatted = {
      relationships,
      attributes: mergeImageAltText(data?.attributes, "hero")
    };
    return projectCollectionsAPI.update(params.id, formatted);
  },
  redirectTo: ({ params }) =>
    `/backend/projects/project-collections/${params.id}`
});

export default function ProjectCollectionSettings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { projectCollection } = useOutletContext() || {};
  const { confirm, confirmation } = useConfirmation();

  const destroyProjectCollection = useApiCallback(
    projectCollectionsAPI.destroy
  );

  const handleDestroy = () => {
    if (!projectCollection) return;
    confirm({
      heading: t("modals.delete_project_collection"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        await destroyProjectCollection(projectCollection.id);
        closeDialog();
        navigate("/backend/projects/project-collections");
      }
    });
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <section>
        <FormContainer.Form
          model={projectCollection}
          className="form-secondary project-collection-form"
          fetcher={fetcher}
        >
          <ProjectCollection.Form.Fields handleDestroy={handleDestroy} />
          <Form.Save text={t("project_collections.save_button_label")} />
        </FormContainer.Form>
      </section>
    </>
  );
}

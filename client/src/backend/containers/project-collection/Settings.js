import { useTranslation } from "react-i18next";
import { useOutletContext, useNavigate } from "react-router-dom";
import withConfirmation from "hoc/withConfirmation";
import ProjectCollection from "backend/components/project-collection";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { projectCollectionsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { useApiCallback } from "hooks";

const formatData = data => {
  const { heroAltText, hero, ...rest } = data?.attributes ?? {};

  const finalHeroData =
    typeof heroAltText === "string" ? { ...hero, altText: heroAltText } : hero;

  const relationships = data.relationships?.subjects
    ? { subjects: { data: data.relationships?.subjects } }
    : {};

  return {
    relationships,
    attributes: { hero: finalHeroData, ...rest }
  };
};

function ProjectCollectionSettings({ confirm }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectCollection } = useOutletContext() || {};

  const destroyProjectCollection = useApiCallback(
    projectCollectionsAPI.destroy,
    {
      requestKey: requests.beProjectCollectionDestroy,
      removes: projectCollection
    }
  );

  const handleDestroy = () => {
    if (!projectCollection) return;
    const heading = t("modals.delete_project_collection");
    const message = t("modals.confirm_body");
    confirm(heading, message, async () => {
      await destroyProjectCollection(projectCollection.id);
      navigate(lh.link("backendProjectCollections"));
    });
  };

  const onSuccess = () => {
    if (!projectCollection) return;
    navigate(lh.link("backendProjectCollection", projectCollection.id));
  };

  if (!projectCollection) return null;

  return (
    <Authorize
      entity={projectCollection}
      ability="update"
      failureNotification
      failureRedirect={lh.link(
        "backendProjectCollection",
        projectCollection.id
      )}
    >
      <section>
        <FormContainer.Form
          model={projectCollection}
          name={requests.beProjectCollectionUpdate}
          update={projectCollectionsAPI.update}
          create={projectCollectionsAPI.create}
          onSuccess={onSuccess}
          className="form-secondary project-collection-form"
          flushOnUnmount={false}
          formatData={formatData}
        >
          <ProjectCollection.Form.Fields handleDestroy={handleDestroy} />
          <Form.Save text={t("project_collections.save_button_label")} />
        </FormContainer.Form>
      </section>
    </Authorize>
  );
}

ProjectCollectionSettings.displayName = "ProjectCollection.Settings";

export default withConfirmation(ProjectCollectionSettings);

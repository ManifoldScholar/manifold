import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import ProjectCollection from "backend/components/project-collection";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { projectCollectionsAPI } from "api";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";

const DEFAULT_MODEL = {
  attributes: {
    numberOfProjects: 8
  },
  relationships: {
    subjects: []
  }
};

export default function ProjectCollectionNew() {
  const { t } = useTranslation();
  const { handleNewSuccess } = useOutletContext() || {};

  return (
    <Authorize
      entity="projectCollection"
      ability="create"
      failureNotification
      failureRedirect={lh.link("backendProjectCollections")}
    >
      <section>
        <FormContainer.Form
          model={DEFAULT_MODEL}
          name="backend-project-collection-create"
          update={projectCollectionsAPI.update}
          create={projectCollectionsAPI.create}
          onSuccess={handleNewSuccess}
          className="form-secondary project-collection-form"
        >
          <ProjectCollection.Form.Fields />
          <Form.Save text={t("project_collections.save_button_label")} />
        </FormContainer.Form>
      </section>
    </Authorize>
  );
}

ProjectCollectionNew.displayName = "ProjectCollection.New";

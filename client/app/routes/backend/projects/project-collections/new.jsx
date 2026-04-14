import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import ProjectCollection from "components/backend/project-collection";
import Form from "components/global/form";
import FormContainer from "global/containers/form";
import { projectCollectionsAPI } from "api";
import authorize from "app/routes/utility/loaders/authorize";
import formAction from "app/routes/utility/helpers/formAction";

export const handle = { drawer: true };

export const loader = ({ request, context }) => {
  return authorize({
    request,
    context,
    ability: "create",
    entity: ["projectCollection"]
  });
};

export const action = formAction({
  mutation: ({ data }) => projectCollectionsAPI.create(data),
  redirectTo: ({ result }) =>
    `/backend/projects/project-collections/${result.data.id}`
});

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
  const fetcher = useFetcher();

  return (
    <section>
      <FormContainer.Form
        model={DEFAULT_MODEL}
        className="form-secondary project-collection-form"
        fetcher={fetcher}
      >
        <ProjectCollection.Form.Fields />
        <Form.Save text={t("project_collections.save_button_label")} />
      </FormContainer.Form>
    </section>
  );
}

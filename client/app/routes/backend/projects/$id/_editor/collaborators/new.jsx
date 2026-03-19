import { useTranslation } from "react-i18next";
import { useOutletContext, useFetcher } from "react-router";
import { collaboratorsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "backend/components/layout";
import AddCollaboratorForm from "backend/components/collaborator/AddForm";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) =>
    collaboratorsAPI.create("projects", params.id, data),
  redirectTo: ({ params }) => `/backend/projects/${params.id}/collaborators`
});

export default function ProjectCollaboratorNew() {
  const { t } = useTranslation();
  const project = useOutletContext();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("projects.add_contributor_label")} />
      <AddCollaboratorForm
        closeUrl={`/backend/projects/${project.id}/collaborators`}
        fetcher={fetcher}
      />
    </section>
  );
}
